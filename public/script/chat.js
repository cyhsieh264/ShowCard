// const socket = io();

// const urlParams = new URLSearchParams(location.search);
// const room = urlParams.get('room');

// const token = localStorage.getItem('access_token');
// axios.post('')

// socket.emit('check user', [room, userToken])

// socket.on('message', message => {
//     $('.room').append(`<p>${message}</p>`)
// });

// $('#send-btn').click( () => {
//     if ($('#msg').val()) {
//         socket.emit('input msg', $('#msg').val())
//         $('#msg').val('')
//     } else {
//         alert('Please enter your message')
//     }
// })

// $('#msg').keypress(function(e) {
//     code = e.keyCode ? e.keyCode : e.which;
//     if ( $('#msg').val() && code == 13 ) {
//         e.preventDefault();
//         socket.emit('input msg', $('#msg').val())
//         $('#msg').val('')
//     } else if ( !$('#msg').val() && code == 13 ) {
//         alert('Please enter your message')
//     }
// });