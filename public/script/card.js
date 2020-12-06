localStorage.setItem('history', location.pathname + location.search)
const urlParams = new URLSearchParams(location.search);
const room = urlParams.get('room');

const checkUser = async () => {
    const payload = await verifyUserToken(userToken);
    if (userToken && payload) {
        $('main').removeClass('hide');
        return payload;
    } else {
        location.replace('/login.html')
    }
};

const api = axios.create({
    headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
    },
    responseType: 'json'
});

// const callApi = (method, endpoint, data) => {
//     if (method == 'get') {
//         api.get(endpoint, data)
//         .then((response) => {
//             const res = response.data;
//             return res;
//         }).catch((err) => {
//             return err.response.data.error;
//         });
//     } else if (method == 'post') {
//         api.get(endpoint, data)
//         .then((response) => {
//             const res = response.data;
//             return res;
//         }).catch((err) => {
//             return err.response.data.error;
//         });
//     }
// }


// api.post('api/1.0/user/signin', user)
// .then((response) => {
//     const res = response.data.data
//     const token = res.user_token;
//     localStorage.setItem('user_token', token);
//     location.replace(history);
// }).catch((err) => {
//     $('#signin-alert').removeClass('hide');
//     $('#signin-alert-msg')[0].innerHTML = err.response.data.error;
// });

checkUser().then( user => {

    const socket = io({
        auth: {
            room: room,
            username: user.name
        }
    });

    // chat

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
    })
    
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

    // canvas

    const canvas = new fabric.Canvas('canvas', {
        width: 600,
        height: 400,
        originX: 'center',
        backgroundColor: '#fff',
    });

    api.get('api/1.0/canvas/check')
    .then((response) => {
        return response.data.data.count
    }).then((count) => {
        if (count == 0) {
            let data = {

                canvas: canvas.toJSON()
            };
            api.post('api/1.0/canvas/init', data)
            .then((response) => {

            })

        }

    });



});

// const socketSend = (data) => {

// }