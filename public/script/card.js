localStorage.setItem('history', location.pathname + location.search)
const urlParams = new URLSearchParams(location.search);
const card = urlParams.get('card');

if (!card) location.replace('/');

const api = axios.create({
    headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
    },
    responseType: 'json'
});

const checkUser = async () => {
    const payload = await verifyUserToken(userToken);
    if (userToken && payload) {
        $('main').removeClass('hide');
        return payload;
    } else {
        location.replace('/login.html');
    }
};

checkUser().then( async (user) => {
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
            alert('Please enter your message')
        }
    });
    $('#msg').keypress(function(e) {
        code = e.keyCode ? e.keyCode : e.which;
        if ( $('#msg').val() && code == 13 ) {
            e.preventDefault();
            socket.emit('input msg', $('#msg').val())
            $('#msg').val('')
        } else if ( !$('#msg').val() && code == 13 ) {
            alert('Please enter your message')
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
    const cardInfo = (await api.get('api/1.0/card/check', { params: { card: card } })).data.data;
    switch (cardInfo.existence) {
        case false:
            const newCard = {
                id: card,
                owner: user.id,
                title: 'untitled'
            };
            await api.post('api/1.0/card/create', newCard);
            await api.post('api/1.0/canvas/save', newCanvas);
            await setUserColor(1);
            break;
        case true:
            // backlog: shared or not
            const memberCount = (await api.patch('api/1.0/card/addmember', { card: card })).data.data.count;
            const userCanvasExistence = (await api.get('api/1.0/canvas/check', { params: { card: card, user: user.id } })).data.data.existence;
            if (!userCanvasExistence) {
                await api.post('api/1.0/canvas/save', newCanvas);
            }
            await setUserColor(memberCount);
            const canvasLoad = (await api.get('api/1.0/canvas/load', { params: { card: card } })).data.data.step;
            await parseObj(canvasLoad);
            break;
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

    canvas.on('path:created', async () => {
        const path = canvas.getObjects()[canvas.getObjects().length-1]
        path.objId = generateId();
        path.user = user.name;
        const object = path.toJSON();
        await newObject(object);
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
    }); 

    $('#add-icon').click( async () => {
        const url = '../images/material/icons/planet.png';
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
        });
    });

    // Modify Object
    canvas.on('object:modified', async () => {
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
        socket.emit('edit canvas', [{action: 'remove', object: object.objId}, { action: 'create', object: [JSON.stringify(object)] }] );
    });

    // Remove Object
    $('#rm-obj').click( async () => {
        const target = canvas.getActiveObjects()[0];
        if (!target) {
            alert('Please select an object');
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
        socket.emit('edit canvas', [{action: 'remove', object: object.objId}] );
    });

    // Undo canvas
    $('#undo-canvas').click( async () => {
        api.get('api/1.0/canvas/undo', { params: { card: card, user: user.id } })
        .then( async (response) => {
            const step = response.data.data.step;
            await parseObj(step);
            socket.emit('edit canvas', step);
        }).catch((error) => {
            alert('Already the last step');
        });
    });

    // Redo canvas
    $('#redo-canvas').click( async () => {
        api.get('api/1.0/canvas/redo', { params: { card: card, user: user.id } })
        .then( async (response) => {
            const step = response.data.data.step;
            await parseObj(step);
            socket.emit('edit canvas', step);
        }).catch((error) => {
            alert('Already the last step');
        });
    });

    // --- CANVAS TOOLBOX ---
    // Brush
    // const brush = new fabric.PatternBrush(canvas);
    $('#brush-on').click(() => {
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