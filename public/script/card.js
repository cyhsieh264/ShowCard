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
        return { owner: cardStatus.owner, ownername: cardStatus.ownername, title: cardStatus.title, user: userInfo };
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
        let element = $('<div>');
        element.attr('class', 'user-status');
        element.html(message)
        $('.room').append(element);
    });
    socket.on('leave', message => {
        let element = $('<div>');
        element.attr('class', 'user-status');
        element.html(message)
        $('.room').append(element);
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
        let code = e.keyCode ? e.keyCode : e.which;
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
        await setUserColor(1);
    } else {
        const cardTitle = res.title;
        $('#card-title').val(cardTitle);
        if (cardOwner != user.id) {
            $('#card-title').attr('readonly', 'readonly');
            $('#card-title').val(cardTitle + `（${res.ownername}'s card）`)
            const userCanvasExistence = (await api.get('api/1.0/canvas/check', { params: { card: card, user: user.id } })).data.data.existence;
            if (!userCanvasExistence) {
                await api.post('api/1.0/canvas/save', newCanvas);
            }
        }
        const memberCount = (await api.patch('api/1.0/card/addmember', { card: card })).data.data.count;
        await setUserColor(memberCount);
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
        console.log(circle)
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
            fontFamily: 'Delicious',   // 字型
            // fontStyle: 'italic',  // 斜體
            // fontSize: 20, // 字型大小
            // fontWeight: 800, // 字型粗細
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

    $('#christmas_hat').click(() => {
        canvas.isDrawingMode = false;
        const url = '../images/assets/icons/christmas_hat.png';
        fabric.Image.fromURL( url, async (item) => {
            const icon = item.set({
                left: 150,
                top: 150, 
                width: 256,
                height: 256,
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
    });

    $('#mistletoe').click(() => {
        canvas.isDrawingMode = false;
        const url = '../images/assets/icons/mistletoe.png';
        fabric.Image.fromURL( url, async (item) => {
            const icon = item.set({
                left: 150,
                top: 150, 
                width: 256,
                height: 256,
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
    });

    $('#christmas_presents').click(() => {
        canvas.isDrawingMode = false;
        const url = '../images/assets/icons/christmas_presents.png';
        fabric.Image.fromURL( url, async (item) => {
            const icon = item.set({
                left: 70,
                top: 100, 
                width: 400,
                height: 400,
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
    });

    $('#christmas_sock').click(() => {
        canvas.isDrawingMode = false;
        const url = '../images/assets/icons/christmas_sock.png';
        fabric.Image.fromURL( url, async (item) => {
            const icon = item.set({
                left: 150,
                top: 150, 
                width: 256,
                height: 256,
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
    });

    $('#candy_cane').click(() => {
        canvas.isDrawingMode = false;
        const url = '../images/assets/icons/candy_cane.png';
        fabric.Image.fromURL( url, async (item) => {
            const icon = item.set({
                left: 150,
                top: 150, 
                width: 256,
                height: 256,
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
    });

    $('#gingerbread_man').click(() => {
        canvas.isDrawingMode = false;
        const url = '../images/assets/icons/gingerbread_man.png';
        fabric.Image.fromURL( url, async (item) => {
            const icon = item.set({
                left: 150,
                top: 150, 
                width: 256,
                height: 256,
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
    });

    $('#santa_claus_1').click(() => {
        canvas.isDrawingMode = false;
        const url = '../images/assets/icons/santa_claus_1.png';
        fabric.Image.fromURL( url, async (item) => {
            const icon = item.set({
                left: 70,
                top: 100, 
                width: 400,
                height: 400,
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
    });

    $('#santa_claus_2').click(() => {
        canvas.isDrawingMode = false;
        const url = '../images/assets/icons/santa_claus_2.png';
        fabric.Image.fromURL( url, async (item) => {
            const icon = item.set({
                left: 70,
                top: 100, 
                width: 400,
                height: 400,
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
    });

    $('#christmas_decoration_border').click(() => {
        canvas.isDrawingMode = false;
        const url = '../images/assets/icons/christmas_decoration_border.png';
        fabric.Image.fromURL( url, async (item) => {
            const icon = item.set({
                left: 8,
                top: 80, 
                width: 524,
                height: 275,
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
    });

    $('#christmas_light_border').click(() => {
        canvas.isDrawingMode = false;
        const url = '../images/assets/icons/christmas_light_border.png';
        fabric.Image.fromURL( url, async (item) => {
            const icon = item.set({
                left: 0,
                top: 80, 
                width: 520,
                height: 100,
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
    });

    $('#heart').click(() => {
        canvas.isDrawingMode = false;
        const url = '../images/assets/icons/heart.png';
        fabric.Image.fromURL( url, async (item) => {
            const icon = item.set({
                left: 0,
                top: 80, 
                width: 256,
                height: 256,
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
    });

    $('#plane').click(() => {
        canvas.isDrawingMode = false;
        const url = '../images/assets/icons/plane.png';
        fabric.Image.fromURL( url, async (item) => {
            const icon = item.set({
                left: 0,
                top: 80, 
                width: 256,
                height: 256,
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
    });

    $('#sun').click(() => {
        canvas.isDrawingMode = false;
        const url = '../images/assets/icons/sun.png';
        fabric.Image.fromURL( url, async (item) => {
            const icon = item.set({
                left: 0,
                top: 80, 
                width: 300,
                height: 300,
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
    });

    $('#humanity').click(() => {
        canvas.isDrawingMode = false;
        const url = '../images/assets/icons/trophy.png';
        fabric.Image.fromURL( url, async (item) => {
            const icon = item.set({
                left: 0,
                top: 80, 
                width: 450,
                height: 450,
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
    });

    $('#beach').click(() => {
        canvas.isDrawingMode = false;
        const url = '../images/assets/icons/beach.png';
        fabric.Image.fromURL( url, async (item) => {
            const icon = item.set({
                left: 0,
                top: 80, 
                width: 400,
                height: 400,
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
    });

    $('#mountain').click(() => {
        canvas.isDrawingMode = false;
        const url = '../images/assets/icons/mountain.png';
        fabric.Image.fromURL( url, async (item) => {
            const icon = item.set({
                left: 0,
                top: 80, 
                width: 450,
                height: 450,
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
    });

    $('#photo').click(() => {
        canvas.isDrawingMode = false;
        const url = '../images/assets/icons/photo.png';
        fabric.Image.fromURL( url, async (item) => {
            const icon = item.set({
                left: 0,
                top: 80, 
                width: 300,
                height: 300,
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
    });

    $('#camera').click(() => {
        canvas.isDrawingMode = false;
        const url = '../images/assets/icons/photo.png';
        fabric.Image.fromURL( url, async (item) => {
            const icon = item.set({
                left: 0,
                top: 80, 
                width: 256,
                height: 256,
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
    });

    $('#trophy').click(() => {
        canvas.isDrawingMode = false;
        const url = '../images/assets/icons/trophy.png';
        fabric.Image.fromURL( url, async (item) => {
            const icon = item.set({
                left: 0,
                top: 80, 
                width: 300,
                height: 300,
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
    });

    $('#leaf').click(() => {
        canvas.isDrawingMode = false;
        const url = '../images/assets/icons/leaf.png';
        fabric.Image.fromURL( url, async (item) => {
            const icon = item.set({
                left: 0,
                top: 80, 
                width: 300,
                height: 300,
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
    });

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

    $('#color_background_1').click((e) => addBackground(e.target.id + '.png'));
    $('#color_background_2').click((e) => addBackground(e.target.id + '.png'));
    $('#color_background_3').click((e) => addBackground(e.target.id + '.png'));
    $('#color_background_4').click((e) => addBackground(e.target.id + '.png'));
    $('#color_background_5').click((e) => addBackground(e.target.id + '.png'));
    $('#color_background_6').click((e) => addBackground(e.target.id + '.png'));
    $('#background_1').click((e) => addBackground(e.target.id + '.jpg'));
    $('#background_2').click((e) => addBackground(e.target.id + '.jpg'));
    $('#background_3').click((e) => addBackground(e.target.id + '.jpg'));
    $('#background_4').click((e) => addBackground(e.target.id + '.jpg'));
    $('#background_5').click((e) => addBackground(e.target.id + '.jpg'));
    $('#background_6').click((e) => addBackground(e.target.id + '.jpg'));
    $('#background_7').click((e) => addBackground(e.target.id + '.jpg'));
    $('#background_8').click((e) => addBackground(e.target.id + '.jpg'));
    $('#background_9').click((e) => addBackground(e.target.id + '.jpg'));
    $('#background_10').click((e) => addBackground(e.target.id + '.jpg'));
    $('#background_11').click((e) => addBackground(e.target.id + '.jpg'));
    $('#background_12').click((e) => addBackground(e.target.id + '.jpg'));

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
            // e.target.on('mousedown', e2 => {             
                // if (e2.transform) {
                    const editObject = fabric.util.object.clone(canvas.getActiveObject());
                    editObject.opacity = 0.5;
                    editObject.selectable = false;
                    editObject.evented = false;
                    socket.emit('edit canvas', [{action: 'remove', object: e.target.objId}, { action: 'create', object: [JSON.stringify(editObject.toJSON())] }] );
                // }
            // });
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
    // const brush = new fabric.PatternBrush(canvas);
    $('#brush-on').click(() => {
        if (canvas.getActiveObject()) {
            socket.emit('edit canvas', [{action: 'remove', object: canvas.getActiveObject().objId}, { action: 'create', object: [JSON.stringify(canvas.getActiveObject().toJSON())] }] );
            canvas.discardActiveObject().renderAll();
        }
        canvas.freeDrawingBrush.color = $('#color-fill').val();
        canvas.freeDrawingBrush.width = 5;
        canvas.isDrawingMode = true
    });

    $('#brush-off').click(() => canvas.isDrawingMode = false);

    $('#color-fill').change( async () => {
        if (canvas.isDrawingMode) {
            canvas.freeDrawingBrush.color = $('#color-fill').val();
            canvas.freeDrawingBrush.width = 5;
        }
        // } else if (canvas.getActiveObject()) {
        //     canvas.getActiveObject().set('fill', $('#color-fill').val());
        //     canvas.renderAll();
        //     const object = canvas.getActiveObjects()[0].toJSON();
        //     object.user = user.name;
        //     const data = {
        //         card_id: card,
        //         user_id: user.id,
        //         action: 'modify',
        //         obj_id: object.objId,
        //         obj_type: object.type,
        //         object: JSON.stringify(object),
        //         is_background: object.isBackground
        //     };
        //     await api.post('api/1.0/canvas/save', data);
        //     await uploadScreenshot();
        //     object.opacity = 0.5;
        //     object.selectable = false;
        //     object.evented = false;
        //     socket.emit('edit canvas', [{action: 'remove', object: object.objId}, { action: 'create', object: [JSON.stringify(object)] }] );
        // }
    });
});

// --- PRELOADER ---
const loader = document.getElementById('loader');
const body = document.getElementsByTagName('body')[0];
body.style.height = '100vh';
window.addEventListener('load', () => {
    loader.style.display = 'none';
    body.style.backgroundImage = "url('../../images/backgrounds/card_background.jpg')";
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

// --- SUBMENU ---
const hideSubmenu = () => {
    $('#explore-icon-box').addClass('hide');
    $('#explore-icon-tool').css('background-color', '#f8f9fa');
    $('#explore-background-box').addClass('hide');
    $('#explore-background-tool').css('background-color', '#f8f9fa');
};

const submenuControl = (target) => {
    hideSubmenu();
    if (target.classList.contains('explore-icon-tool')) {
        $('#explore-icon-tool').css('cssText', 'background-color: #d9e0e6 !important;');
        $('#explore-icon-box').removeClass('hide');
    } else if (target.classList.contains('explore-background-tool')) {
        $('#explore-background-tool').css('cssText', 'background-color: #d9e0e6 !important;');
        $('#explore-background-box').removeClass('hide');
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