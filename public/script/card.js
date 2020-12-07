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
    // --- CARD ---
    // Check card and set user color
    let memberCount;
    const setUserColor = async () => {
        const colors = ['#6e6b64', '#1a326b', '#8c355e', '#cc9543', '#58ad49', '#f5e8cb', '#402745', '#6bc2a6', '#b2bad1', '#f5940c'];
        const index = memberCount % 10;
        localStorage.setItem('color_'+card, colors[index]);
    };
    const cardExistence = (await api.get('api/1.0/card/check', { params: { card: card } })).data.data.existence;
    if (!cardExistence) {
        const newCard = {
            id: card,
            owner: user.id, // no id???
            title: 'untitled'
        };
        await api.post('api/1.0/card/create', newCard);
        memberCount = 1;
        await setUserColor()
    } else {
        // 確認是否開放?
        memberCount = (await api.patch('api/1.0/card/addmember', { card: card })).data.data.count;
        await setUserColor();
    }
    // --- CANVAS ---
    // Generate canvas
    // function newControls(control, ctx, methodName, left, top) {
    //     if (!this.isControlVisible(control)) {
    //         return;
    //     }
    //     var size = this.cornerSize;
    //     this.transparentCorners || ctx.clearRect(left, top, size, size);
    //     ctx.beginPath();
    //     ctx.arc(left + size/2, top + size/2, size/2, 0, 2 * Math.PI, false);
    //     ctx.stroke();
    // }
    // fabric.Object.prototype._drawControl = newControls;
    fabric.Object.prototype.padding = 10;

    const canvas = new fabric.Canvas('canvas', {
        width: 600,
        height: 400,
        originX: 'center',
        backgroundColor: '#ffffff',
    });
    // Color Selector

    // Brush
    const brush = new fabric.PatternBrush(canvas);
    $('#brush-on').click(() => canvas.isDrawingMode = true);
    $('#brush-off').click(() => canvas.isDrawingMode = false);
    // Icon

    // Text
    const textbox = new fabric.Textbox('hello world', { 
        left: 150, 
        top: 100,
        editable: true,
        width: 300,
        textAlign: 'center',
        fill: '#8a91ab', // 字型顏色
        fontFamily: 'Delicious', // 設定字型
        // fontStyle: 'italic',  // 斜體
        // fontSize: 20, // 字型大小
        // fontWeight: 800, // 字型粗細
    });
    canvas.add(textbox);
    // Shape
    const rect = new fabric.Rect({
        height: 100,
        width: 200,
        top: 200,
        left: 200,
        fill: '#fcba03'
    })
    canvas.add(rect);
    const rect2 = new fabric.Rect({
        height: 100,
        width: 200,
        top: 250,
        left: 80,
        fill: '#42f587'
    })
    canvas.add(rect2);
    canvas.setActiveObject(rect2);
    // Remove Object
    $('#rm-obj').click(() => {
        const objects = canvas.getActiveObjects();
        objects.map(obj => canvas.remove(obj));
    });
    // --- CANVAS OPERATE ---
    // Initialize
    const canvasExistence = (await api.get('api/1.0/canvas/check', { params: { card: card, user: user.id } })).data.data.existence;
    if (!canvasExistence) {
        const newCanvas = {
            card_id: card,
            user_id: user.id,
            user_name: user.name,
            action: 'origin',
            canvas: canvas.toJSON()
        };
        await api.post('api/1.0/canvas/init', newCanvas);
    } else {
        const step = (await api.get('api/1.0/canvas/load', { params: { card: card } })).data.data.step;
        canvas.clear();
        canvas.loadFromJSON(step.canvas, canvas.renderAll.bind(canvas));
    }
    // Save canvas
    const saveCanvas = async() => {
        const data = {
            card_id: card,
            user_id: user.id,
            user_name: user.name,
            action: 'modify',
            canvas: canvas.toJSON()
        };
        await api.post('api/1.0/canvas/save', data);
        socket.emit('edit canvas', data.canvas);
    }
    $('#save-canvas').click(saveCanvas);
    canvas.on('object:modified', saveCanvas);
    canvas.on('object:created', saveCanvas);
    canvas.on('object:removed', saveCanvas);
    canvas.on('path:created', saveCanvas);
    // Undo canvas
    $('#undo-canvas').click( async () => {
        api.get('api/1.0/canvas/undo', { params: { card: card, user: user.id } })
        .then((response) => {
            const step = response.data.data.step;
            canvas.clear();
            canvas.loadFromJSON(step.canvas, canvas.renderAll.bind(canvas));
            socket.emit('edit canvas', step.canvas);
        }).catch((error) => {
            alert('Already the last step');
        });
    });
    // Redo canvas
    $('#redo-canvas').click( async () => {
        api.get('api/1.0/canvas/redo', { params: { card: card, user: user.id } })
        .then((response) => {
            const step = response.data.data.step;
            canvas.clear();
            canvas.loadFromJSON(step.canvas, canvas.renderAll.bind(canvas));
            socket.emit('edit canvas', step.canvas);
        }).catch((error) => {
            alert('Already the last step');
        });
    });
    // Change canvas
    socket.on('change canvas', (newCanvas) => { 
        canvas.clear();
        canvas.loadFromJSON(newCanvas, canvas.renderAll.bind(canvas));
    });
});