const socket = io('/');
socket.on('message', message => {
    console.log(message)
    $('#test').append(`<p>${message}</p>`)
});