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

const checkUser = async () => {
    const payload = await verifyUserToken(userToken);
    if (userToken && payload) {
        $('main').removeClass('hide');
        return payload;
    } else {
        location.replace('/login.html')
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
        // count member and get color?
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
    // --- Card ---
    // Check card
    const cardExistence = (await api.get('api/1.0/card/check', { params: { card: card } })).data.data.existence;
    if (!cardExistence) {
        let newCard = {
            id: card,
            owner: user.id,
            title: $('#card-title').val()
        };
        await api.post('api/1.0/card/create', newCard);
    } else {
        await api.patch('api/1.0/card/member/add');
    }
    // --- CANVAS ---
    // Generate canvas
    const canvas = new fabric.Canvas('canvas', {
        width: 600,
        height: 400,
        originX: 'center',
        backgroundColor: '#fff',
    });
    // Initialize
    const canvasExistence = (await api.get('api/1.0/canvas/check', { params: { card: card } })).data.data.existence;
    if (!canvasExistence) {
        let newCanvas = {
            card_id: card,
            user_id: user.id,
            user_name: user.name,
            canvas: canvas.toJSON()
        };
        await api.post('api/1.0/canvas/init', newCanvas);
    } else {
        const step = (await api.get('api/1.0/canvas/load', { params: { card: card } })).data.data.step;
        canvas.clear();
        canvas.loadFromJSON(step.canvas, canvas.renderAll.bind(canvas));
    }


    
});

// const socketSend = (data) => {

// }