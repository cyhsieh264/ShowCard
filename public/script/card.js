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

const check = async () => {
    const cardStatus = (await api.get('api/1.0/card/check', { params: { card: card } })).data.data;
    if (cardStatus.existence == false) location.replace('/404.html');
    const userInfo = await verifyUserToken(userToken);
    if (userToken && userInfo) {
        $('main').removeClass('hide');
        return { owner: cardStatus.owner, user: userInfo };
    } else {
        location.replace('/login.html');
    }
};

check().then( async (res) => {
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
    socket.on('join', message => {
        $('.room').append(`<p>${message}</p>`)
    });
    socket.on('leave', message => {
        $('.room').append(`<p>${message}</p>`)
    });
    socket.on('message', message => {
        $('.room').append(`<p>${message}</p>`)
    });
    $('#send-btn').click( () => {
        if ($('#msg').val()) {
            socket.emit('input msg', $('#msg').val())
            $('#msg').val('')
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
        code = e.keyCode ? e.keyCode : e.which;
        if ( $('#msg').val() && code == 13 ) {
            e.preventDefault();
            socket.emit('input msg', $('#msg').val())
            $('#msg').val('')
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
    const setUserColor = async (num) => {
        const colors = ['#6e6b64', '#1a326b', '#8c355e', '#cc9543', '#58ad49', '#f5e8cb', '#402745', '#6bc2a6', '#b2bad1', '#f5940c'];
        const index = num % 10;
        localStorage.setItem('color_'+card, colors[index]);
    };
    if (!cardOwner) {
        const newCard = {
            id: card,
            owner: user.id,
            title: 'untitled'
        };
        await api.post('api/1.0/card/create', newCard);
        await api.post('api/1.0/canvas/save', newCanvas);
        await uploadScreenshot();
        await setUserColor(1);
    } else {
        const memberCount = (await api.patch('api/1.0/card/addmember', { card: card })).data.data.count;
        const userCanvasExistence = (await api.get('api/1.0/canvas/check', { params: { card: card, user: user.id } })).data.data.existence;
        if (!userCanvasExistence) {
            await api.post('api/1.0/canvas/save', newCanvas);
        }
        await setUserColor(memberCount);
        const canvasLoad = (await api.get('api/1.0/canvas/load', { params: { card: card } })).data.data.step;
        parseObj(canvasLoad);
    }
    
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
            object: JSON.stringify(object)
        };
        await api.post('api/1.0/canvas/save', data);
        socket.emit('edit canvas', [{ action: 'create', object: [JSON.stringify(object)] }] );
    };

    $('#test').click( async () => {
        const obj = canvas.getActiveObject();
        canvas.sendToBack(obj);
    })

    canvas.on('path:created', async () => {
        const path = canvas.getObjects()[canvas.getObjects().length-1]
        path.objId = generateId();
        path.user = user.name;
        const object = path.toJSON();
        await newObject(object);
        await uploadScreenshot();
    });

    $('#add-circle').click( async () => {
        canvas.isDrawingMode = false;
        const circle = new fabric.Circle({
            left: 250, 
            top: 200,
            strokeWidth: 5,
            radius: 60,
            stroke: $('#color-border').val(),
            fill: $('#color-fill').val(),
            originX: 'center',
            originY: 'center',
            objId: generateId(),
            user: user.name
        });
        canvas.add(circle);
        canvas.setActiveObject(circle);
        const object = circle.toJSON();
        await newObject(object);
        await uploadScreenshot();
    });

    $('#add-rect').click( async () => {
        canvas.isDrawingMode = false;
        let rect = new fabric.Rect({
            height: 100,
            width: 200,
            top: 200,
            left: 300,
            fill: $('#color-fill').val(),
            stroke: $('#color-border').val(),
            strokeWidth: 5,
            objId: generateId(),
            user: user.name
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
            fontFamily: 'Delicious',   // 字型
            // fontStyle: 'italic',  // 斜體
            // fontSize: 20, // 字型大小
            // fontWeight: 800, // 字型粗細
            objId: generateId(),
            user: user.name
        });
        canvas.add(textbox);
        canvas.setActiveObject(textbox);
        const object = textbox.toJSON();
        await newObject(object);
        await uploadScreenshot();
    }); 

    $('#add-icon').click( async () => {
        const url = '../images/assets/icons/planet.png';
        fabric.Image.fromURL( url, async (item) => {
            const icon = item.set({
                left: 0,
                top: 0, 
                width: 150,
                height: 150,
                objId: generateId(),
                user: user.name
            });
            canvas.add(icon);
            canvas.setActiveObject(icon);
            const object = icon.toJSON();
            await newObject(object);
            await uploadScreenshot();
        });
    });

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
            object: JSON.stringify(object)
        };
        await api.post('api/1.0/canvas/save', data);
        await uploadScreenshot();
        socket.emit('edit canvas', [{action: 'remove', object: object.objId}, { action: 'create', object: [JSON.stringify(object)] }] );
    });

    // Remove Object
    $('#rm-obj').click( async () => {
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
            object: JSON.stringify(object)
        };
        await api.post('api/1.0/canvas/save', data);
        canvas.remove(target);
        await uploadScreenshot();
        socket.emit('edit canvas', [{action: 'remove', object: object.objId}] );
    });

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
            e.target.on('mousedown', e => {                
                if (e.transform) {
                    const editObject = fabric.util.object.clone(canvas.getActiveObject());
                    editObject.set('opacity', 0.5);
                    editObject.opacity = 0.5;
                    editObject.selectable = false;
                    editObject.evented = false;
                    socket.emit('edit canvas', [{action: 'remove', object: e.target.objId}, { action: 'create', object: [JSON.stringify(editObject.toJSON())] }] );
                }
            });
        }
    });
    
    canvas.on('before:selection:cleared', e => {
        socket.emit('edit canvas', [{action: 'remove', object: e.target.objId}, { action: 'create', object: [JSON.stringify(e.target.toJSON())] }] );
    });

    canvas.on('selection:updated', e => {
        socket.emit('edit canvas', [{action: 'remove', object: e.deselected[0].objId}, { action: 'create', object: [JSON.stringify(e.deselected[0].toJSON())] }] );
    });

    // --- CANVAS TOOLBOX ---
    // Brush
    // const brush = new fabric.PatternBrush(canvas);
    $('#brush-on').click(() => {
        if (canvas.getActiveObject()) canvas.discardActiveObject().renderAll();
        canvas.freeDrawingBrush.color = $('#color-fill').val();
        canvas.freeDrawingBrush.width = 5;
        canvas.isDrawingMode = true
    });

    $('#brush-off').click(() => canvas.isDrawingMode = false);

    $('#color-fill').mousemove(() => {
        canvas.freeDrawingBrush.color = $('#color-fill').val();
        canvas.freeDrawingBrush.width = 5;
    });
});

// --- PRELOADER ---
const loader = document.getElementById('loader');
const body = document.getElementsByTagName('body')[0];
body.style.height = '100vh';
window.addEventListener('load', () => {
    loader.style.display = 'none';
    body.style.backgroundImage = "url('../../images/backgrounds/grid.jpg')";
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
    $('#share-link-copy').attr('src', './images/icons/copy_hover.png')}, () => {
        $('#share-link-copy').attr('src', './images/icons/copy.png')
    }
);

// --- SAVE SCREENSHOT ---
$('#canvas').change(() => {
    console.log('chan')
});

