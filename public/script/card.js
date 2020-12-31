localStorage.setItem('history', location.pathname + location.search)
const urlParams = new URLSearchParams(location.search);
const card = urlParams.get('card');

const api = axios.create({
    headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
    },
    responseType: 'json'
});

const uploadScreenshot = () => {
    return new Promise((resolve, reject) => {
        const obj = canvas.getActiveObject();
        if (obj) canvas.discardActiveObject();
        const screenshot = canvas.toDataURL('image/jpeg', 1.0);
        if (obj) canvas.setActiveObject(obj);
        canvas.renderAll();
        const data = { card: card, screenshot: screenshot };
        api.post('api/1.0/canvas/screenshot', data)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    })
};

const checkCardStatus = async () => {
    const cardStatus = (await api.get('api/1.0/card/check', { params: { card: card } })).data.data;
    if (cardStatus.existence == false) location.replace('/404.html');
    const userInfo = await verifyUserToken(userToken);
    if (userToken && userInfo) {
        $('main').removeClass('hide');
        return { owner: cardStatus.owner, ownername: cardStatus.ownername, title: cardStatus.title, user: userInfo };
    } else {
        location.replace('/login.html');
    }
};

checkCardStatus().then( async (res) => {
    const cardOwner = res.owner;
    const user = res.user;
    const socket = io({
        auth: {
            cid: card,
            uid: user.id,
            username: user.name
        }
    });

    // --- CHAT ---

    const roomBroadcast = (message) => {
        let element = $('<div>');
        element.attr('class', 'user-status');
        element.html(message)
        $('.room').append(element);
        $('.room')[0].scrollTop = $('.room')[0].scrollHeight;
    };

    const sendMessage = () => {
        socket.emit('input msg', $('#msg').val());
        let selfElement = $('<div>');
        selfElement.attr('class', 'self-chat');
        let selfNameElement = $('<div>');
        selfNameElement.attr('class', 'user-self-name');
        selfNameElement.html(user.name);
        selfElement.append(selfNameElement);
        let selfMassageElement = $('<div>');
        selfMassageElement.attr('class', 'user-self-message');
        selfMassageElement.html($('#msg').val());
        selfElement.append(selfMassageElement);
        $('.room').append(selfElement);
        $('.room')[0].scrollTop = $('.room')[0].scrollHeight;
        $('#msg').val('');
    };

    const receiveMessage = (message) => {
        let otherElement = $('<div>');
        otherElement.attr('class', 'other-chat');
        let otherNameElement = $('<div>');
        otherNameElement.attr('class', 'user-other-name');
        otherNameElement.html(message[0]);
        otherElement.append(otherNameElement);
        let otherMassageElement = $('<div>');
        otherMassageElement.attr('class', 'user-other-message');
        otherMassageElement.html(message[1]);
        otherElement.append(otherMassageElement);
        $('.room').append(otherElement);
        $('.room')[0].scrollTop = $('.room')[0].scrollHeight;
    };

    socket.on('join', message => roomBroadcast(message));

    socket.on('leave', message => roomBroadcast(message));

    socket.on('message', message => receiveMessage(message));

    $('#send-btn').click( () => {
        if ($('#msg').val()) {
            if (($('#msg').val()).includes('<script>')) {
                swal({
                    title: 'Notification',
                    text: 'Invalid Input',
                    type: 'warning',
                    confirmButtonText: 'OK'
                });
                return;
            }
            sendMessage();
        } else {
            swal({
                title: 'Notification',
                text: 'Please Enter Your Message',
                type: 'warning',
                confirmButtonText: 'OK'
            });
        }
    });

    $('#msg').keypress(function(e) {
        let code = e.keyCode ? e.keyCode : e.which;
        if ( $('#msg').val() && code == 13 ) {
            if (($('#msg').val()).includes('<script>')) {
                swal({
                    title: 'Notification',
                    text: 'Invalid Input',
                    type: 'warning',
                    confirmButtonText: 'OK'
                });
                return;
            }
            e.preventDefault();
            sendMessage();
        } else if ( !$('#msg').val() && code == 13 ) {
            swal({
                title: 'Notification',
                text: 'Please Enter Your Message',
                type: 'warning',
                confirmButtonText: 'OK'
            });
        }
    });

    // --- CARD AND CANVAS INIT ---
    const newCanvas = {
        card_id: card,
        user_id: user.id,
        action: 'origin',
        obj_id: null,
        obj_type: null,
        object: null
    };
    if (!cardOwner) {
        const cardTitle = (await api.get('api/1.0/card/title', { params: { user: user.id } })).data.data.title;
        $('#card-title').val(cardTitle);
        const newCard = {
            id: card,
            owner: user.id,
            title: cardTitle
        };
        await api.post('api/1.0/card/create', newCard);
        await api.post('api/1.0/canvas/save', newCanvas);
        await uploadScreenshot();
    } else {
        const cardTitle = res.title;
        $('#card-title').val(cardTitle);
        if (cardOwner != user.id) {
            $('#card-title').attr('readonly', 'readonly');
            $('#card-title').val(cardTitle);
            $('#self-title-description').addClass('hide');
            $('#other-title-description').removeClass('hide');
            roomBroadcast(`Welcome To ${res.ownername}'s Card`);
            const userCanvasExistence = (await api.get('api/1.0/canvas/check', { params: { card: card, user: user.id } })).data.data.existence;
            if (!userCanvasExistence) {
                await api.post('api/1.0/canvas/save', newCanvas);
            }
        }
        const canvasLoad = (await api.get('api/1.0/canvas/load', { params: { card: card } })).data.data.step;
        parseObj(canvasLoad);
    }
    
    // --- RENAME CARD ---
    $('#card-title').change( async () => {
        const title = $('#card-title').val();
        await api.patch('api/1.0/card/rename', { card: card, title: title });
        socket.emit('rename card', title);
    });

    socket.on('change title', title => {
        $('#card-title').val(title + `（${res.ownername}'s card）`)
    })
    
    // --- CANVAS EVENT ---
    socket.on('change canvas', (step) => parseObj(step));

    // Create Object
    const newObject = async(object) => {
        const data = {
            card_id: card,
            user_id: user.id,
            action: 'create',
            obj_id: object.objId,
            obj_type: object.type,
            object: JSON.stringify(object),
            is_background: object.isBackground
        };
        await api.post('api/1.0/canvas/save', data);
        socket.emit('edit canvas', [{ action: 'create', object: [JSON.stringify(object)] }] );
    };

    canvas.on('path:created', async () => {
        const path = canvas.getObjects()[canvas.getObjects().length-1]
        path.objId = generateId();
        path.user = user.name;
        path.isBackground = false;
        const object = path.toJSON();
        await newObject(object);
        await uploadScreenshot();
    });

    $('#add-circle').click( async () => {
        canvas.isDrawingMode = false;
        const circle = new fabric.Circle({
            left: 270, 
            top: 270,
            radius: 100,
            fill: $('#color-fill').val(),
            originX: 'center',
            originY: 'center',
            objId: generateId(),
            user: user.name,
            isBackground: false
        });
        canvas.add(circle);
        canvas.setActiveObject(circle);
        const object = circle.toJSON();
        await newObject(object);
        await uploadScreenshot();
    });

    $('#add-square').click( async () => {
        canvas.isDrawingMode = false;
        let rect = new fabric.Rect({
            height: 180,
            width: 180,
            top: 170,
            left: 170,
            fill: $('#color-fill').val(),
            objId: generateId(),
            user: user.name,
            isBackground: false
        });
        canvas.add(rect);
        canvas.setActiveObject(rect);
        const object = rect.toJSON();
        await newObject(object);
        await uploadScreenshot();
    });

    $('#add-triangle').click( async () => {
        canvas.isDrawingMode = false;
        let rect = new fabric.Triangle({
            height: 180,
            width: 180,
            top: 170,
            left: 170,
            fill: $('#color-fill').val(),
            objId: generateId(),
            user: user.name,
            isBackground: false
        });
        canvas.add(rect);
        canvas.setActiveObject(rect);
        const object = rect.toJSON();
        await newObject(object);
        await uploadScreenshot();
    });

    $('#add-text').click( async () => {
        canvas.isDrawingMode = false;
        const textbox = new fabric.Textbox('text', { 
            left: 150, 
            top: 100,
            editable: true,
            width: 300,
            textAlign: 'center',
            fill: $('#color-fill').val(), 
            fontFamily: 'Delicious',
            objId: generateId(),
            user: user.name,
            isBackground: false
        });
        canvas.add(textbox);
        canvas.setActiveObject(textbox);
        const object = textbox.toJSON();
        await newObject(object);
        await uploadScreenshot();
    }); 

    // === icon === 

    const addIcon = (filename, width, height, left, top) => {
        canvas.isDrawingMode = false;
        const url = `../images/assets/icons/${filename}`;
        fabric.Image.fromURL( url, async (item) => {
            const icon = item.set({
                left: left,
                top: top, 
                width: width,
                height: height,
                objId: generateId(),
                user: user.name,
                isBackground: false
            });
            canvas.add(icon);
            canvas.setActiveObject(icon);
            const object = icon.toJSON();
            await newObject(object);
            await uploadScreenshot();
        });
    };

    // === background === 

    const addBackground = (filename) => {
        canvas.isDrawingMode = false;
        removePresentBackground();
        const url = `../images/assets/backgrounds/${filename}`;
        fabric.Image.fromURL( url, async (item) => {
            const background = item.set({
                left: 0,
                top: 0, 
                width: 540,
                height: 540,
                evented: false,
                selected: false,
                objId: generateId(),
                user: user.name,
                isBackground: true
            });
            canvas.add(background);
            canvas.sendToBack(background);
            const object = background.toJSON();
            await newObject(object);
            await uploadScreenshot();
        });
    };

    // Modify Object
    canvas.on('object:modified', async () => {
        canvas.bringToFront(canvas.getActiveObject())
        const object = canvas.getActiveObjects()[0].toJSON();
        object.user = user.name;
        const data = {
            card_id: card,
            user_id: user.id,
            action: 'modify',
            obj_id: object.objId,
            obj_type: object.type,
            object: JSON.stringify(object),
            is_background: object.isBackground
        };
        await api.post('api/1.0/canvas/save', data);
        await uploadScreenshot();
        socket.emit('edit canvas', [{action: 'remove', object: object.objId}, { action: 'create', object: [JSON.stringify(object)] }] );
    });

    // Remove Object

    const removeObject = async () => {
        const target = canvas.getActiveObjects()[0];
        if (!target) {
            swal({
                title: 'Notification',
                text: 'Please Select An Object',
                type: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }
        const object = target.toJSON();
        const data = {
            card_id: card,
            user_id: user.id,
            action: 'remove',
            obj_id: object.objId,
            obj_type: object.type,
            object: JSON.stringify(object),
            is_background: object.isBackground
        };
        await api.post('api/1.0/canvas/save', data);
        canvas.remove(target);
        await uploadScreenshot();
        socket.emit('edit canvas', [{action: 'remove', object: object.objId}] );
    };

    $('#rm-obj').click(removeObject);

    // Undo canvas
    $('#undo-canvas').click( async () => {
        api.get('api/1.0/canvas/undo', { params: { card: card, user: user.id } })
        .then( async (response) => {
            const step = response.data.data.step;
            parseObj(step);
            await uploadScreenshot();
            socket.emit('edit canvas', step);
        }).catch((error) => {
            swal({
                title: 'Notification',
                text: 'Already The Last Step',
                type: 'warning',
                confirmButtonText: 'OK'
            });
        });
    });

    // Redo canvas
    $('#redo-canvas').click( async () => {
        api.get('api/1.0/canvas/redo', { params: { card: card, user: user.id } })
        .then( async (response) => {
            const step = response.data.data.step;
            parseObj(step);
            await uploadScreenshot();
            socket.emit('edit canvas', step);
        }).catch((error) => {
            swal({
                title: 'Notification',
                text: 'Already The Last Step',
                type: 'warning',
                confirmButtonText: 'OK'
            });
        });
    });

    // Lock Object
    canvas.on('mouse:down', e => {
        if (e.target != null && canvas.getActiveObjects().length != 0) {
            const editObject = fabric.util.object.clone(canvas.getActiveObject());
            editObject.opacity = 0.5;
            editObject.selectable = false;
            editObject.evented = false;
            socket.emit('edit canvas', [{action: 'remove', object: e.target.objId}, { action: 'create', object: [JSON.stringify(editObject.toJSON())] }] );
        }
    });
    
    canvas.on('before:selection:cleared', e => {
        if (e.e != undefined) {
            canvas.bringToFront(e.target);
            socket.emit('edit canvas', [{action: 'remove', object: e.target.objId}, { action: 'create', object: [JSON.stringify(e.target.toJSON())] }] );
        }
    });

    canvas.on('selection:updated', e => {
        socket.emit('edit canvas', [{action: 'remove', object: e.deselected[0].objId}, { action: 'create', object: [JSON.stringify(e.deselected[0].toJSON())] }] );
    });

    // --- CANVAS TOOLBOX ---
    // Brush
    $('#brush').click(() => {
        if (canvas.getActiveObject()) {
            socket.emit('edit canvas', [{action: 'remove', object: canvas.getActiveObject().objId}, { action: 'create', object: [JSON.stringify(canvas.getActiveObject().toJSON())] }] );
            canvas.discardActiveObject().renderAll();
        }
        const value = $('#brush-text').html();
        if (value == 'Brush On') {
            $('#brush-text').html('Brush Off');
            $('#brush-image').attr('src', 'https://d20bzyreixm85i.cloudfront.net/images/icons/tool_brush_on.png');
            canvas.freeDrawingBrush.color = $('#color-fill').val();
            canvas.freeDrawingBrush.width = 5;
            canvas.isDrawingMode = true;
        }
        if (value == 'Brush Off') {
            canvas.isDrawingMode = false;
            $('#brush-text').html('Brush On');
            $('#brush-image').attr('src', 'https://d20bzyreixm85i.cloudfront.net/images/icons/tool_brush.png');
        }
    });

    $('#color-fill').on('input', async () => {
        if (canvas.isDrawingMode) {
            canvas.freeDrawingBrush.color = $('#color-fill').val();
            canvas.freeDrawingBrush.width = 5;
        } else if (canvas.getActiveObject()) {
            let colorKey;
            if (canvas.getActiveObject().type == 'path') colorKey = 'stroke';
            else colorKey = 'fill';
            canvas.getActiveObject().set(colorKey, $('#color-fill').val());
            canvas.renderAll();
            const object = canvas.getActiveObjects()[0].toJSON();
            object.user = user.name;
            const data = {
                card_id: card,
                user_id: user.id,
                action: 'modify',
                obj_id: object.objId,
                obj_type: object.type,
                object: JSON.stringify(object),
                is_background: object.isBackground
            };
            await api.post('api/1.0/canvas/save', data);
            await uploadScreenshot();
            object.opacity = 0.5;
            object.selectable = false;
            object.evented = false;
            socket.emit('edit canvas', [{action: 'remove', object: object.objId}, { action: 'create', object: [JSON.stringify(object)] }] );
        }
    });

    // --- SUBMENU ---

    const fetchAssets = async (category) => {
        const assets = (await api.get(`api/1.0/asset/${category}`)).data.data.assets;
        return assets;
    };

    const hideSubmenu = () => {
        $('.list-group-item').addClass('tool-item');
        $('#explore-icon-box').addClass('hide');
        $('#explore-icon-tool').css('background-color', '#f8f9fa');
        $('#explore-background-box').addClass('hide');
        $('#explore-background-tool').css('background-color', '#f8f9fa');
        $('#color').removeClass('tool-item');
    };

    const submenuControl = async (target) => {
        hideSubmenu();
        if (target.classList.contains('explore-icon-tool')) {
            $('#explore-icon-tool').css('cssText', 'background-color: #d9e0e6 !important;');
            $('#explore-icon-box').removeClass('hide');
            $('.list-group-item').removeClass('tool-item');
            const iconAmount = (document.getElementById('asset-icon')).getElementsByClassName('explore-item').length;
            if (iconAmount == 0) {
                const assets = await fetchAssets('icon');
                assets.map((asset) => {
                    let element = $('<img>');
                    element.attr('id', asset.title);
                    element.attr('class', 'explore-item explore-icon-tool');
                    element.attr('src', `https://d20bzyreixm85i.cloudfront.net/images/assets/icons/${asset.title+asset.format}`);
                    $('#asset-icon').append(element);
                    document.getElementById(asset.title).addEventListener('click', () => addIcon(asset.title + asset.format, asset.width, asset.height, asset.left, asset.top));
                });
            }
        } else if (target.classList.contains('explore-background-tool')) {
            $('#explore-background-tool').css('cssText', 'background-color: #d9e0e6 !important;');
            $('#explore-background-box').removeClass('hide');
            $('.list-group-item').removeClass('tool-item');
            const backgroundAmount = (document.getElementById('asset-background')).getElementsByClassName('explore-item').length;
            if (backgroundAmount == 0) {
                const assets = await fetchAssets('background');
                assets.map((asset) => {
                    let element = $('<img>');
                    element.attr('id', asset.title);
                    element.attr('class', 'explore-item explore-background-tool');
                    if (asset.title == 'color_background_1') element.attr('src', `https://d20bzyreixm85i.cloudfront.net/images/assets/backgrounds/color_background_1_border${asset.format}`);
                    else element.attr('src', `https://d20bzyreixm85i.cloudfront.net/images/assets/backgrounds/${asset.title+asset.format}`);
                    $('#asset-background').append(element);
                    document.getElementById(asset.title).addEventListener('click', () => addBackground(asset.title + asset.format));
                });
            }
        }
    };

    $('#header').click(() => {
        hideSubmenu();
    });

    $('#wrapper').click((e) => {
        hideSubmenu();
    });

    $('#toolbox').click((e) => {
        submenuControl(e.target)
    });
});

// --- PRELOADER ---
const loader = document.getElementById('loader');
const body = document.getElementsByTagName('body')[0];
body.style.height = '100vh';
window.addEventListener('load', () => {
    loader.style.display = 'none';
    body.style.backgroundImage = "url('https://d20bzyreixm85i.cloudfront.net/images/backgrounds/card_background.jpg')";
    body.style.backgroundSize = '70%';
    body.style.height = 'unset';
});

// --- DOWNLOAD IMAGE ---
$('#save').on('click', function () {
    if (canvas.getActiveObject()) canvas.discardActiveObject().renderAll();
    const _canvas = document.getElementsByTagName('canvas')[0];
    this.href = _canvas.toDataURL();
});

// --- CHAT BOX ---
$('#open-chat-btn').click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});

$('#share-link-btn').click(() => {
    const text = $('#share-link-input')[0];
    text.select();
    document.execCommand('copy');
});

$('#share-link-input').val(location.href);

$('#share-link-btn').hover(() => {
    $('#share-link-copy').attr('src', 'https://d20bzyreixm85i.cloudfront.net/images/icons/copy_hover.png')}, () => {
        $('#share-link-copy').attr('src', 'https://d20bzyreixm85i.cloudfront.net/images/icons/copy.png');
    }
);