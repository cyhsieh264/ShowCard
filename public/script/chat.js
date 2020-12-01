const socket = io();

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