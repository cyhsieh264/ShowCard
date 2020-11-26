const socket = io();

socket.on('message', message => {
    $('.room').append(`<p>${message}</p>`)
});

$('#send-btn').click( () => {
    if ($('#msg').val()) {
        socket.emit('input msg', $('#msg').val())
        $('#msg').val('')
    } else {
        alert('please enter message')
    }
})
