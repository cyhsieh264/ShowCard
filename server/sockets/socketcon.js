const socketCon = (io) => {
    io.on('connection', (socket) => {   // 相當於 function x (socket) {}
        console.log('a user connected');
        const user = 'Server'
        const msg = 'Welcome!'
        socket.emit('message', [`${user} :  ${msg} `, (new Date()).toLocaleString()]);
        socket.on('input msg', (msg) => {
            if (msg == 'hi') {
                socket.emit('message', [`You :  ${msg} `, (new Date()).toLocaleString()])
                setTimeout(() => {
                    socket.emit('message', [`${user} :  Have a nice day!! `, (new Date()).toLocaleString()])
                }, 500);
            } else {
                socket.emit('message', [`You :  ${msg} `, (new Date()).toLocaleString()])
                setTimeout(() => {
                    socket.emit('message', [`${user} :  Oh, I see. `, (new Date()).toLocaleString()])
                }, 500);
            }
            // socket.emit('message', [`You :  ${msg} `, (new Date()).toLocaleString()])
        })
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
}


// io.on('connection', (socket) => {   // 相當於 function x (socket) {}
//     console.log('a user connected');
//     const user = 'Server'
//     const msg = 'Welcome!'
//     socket.emit('message', [`${user} :  ${msg} `, (new Date()).toLocaleString()]);
//     socket.on('input msg', (msg) => {
//         if (msg == 'hi') {
//             socket.emit('message', [`You :  ${msg} `, (new Date()).toLocaleString()])
//             setTimeout(() => {
//                 socket.emit('message', [`${user} :  Have a nice day!! `, (new Date()).toLocaleString()])
//             }, 500);
//         } else {
//             socket.emit('message', [`You :  ${msg} `, (new Date()).toLocaleString()])
//             setTimeout(() => {
//                 socket.emit('message', [`${user} :  Oh, I see. `, (new Date()).toLocaleString()])
//             }, 500);
//         }
//         // socket.emit('message', [`You :  ${msg} `, (new Date()).toLocaleString()])
//     })
//     socket.on('disconnect', () => {
//         console.log('user disconnected');
//     });
// });


const errorHandling = (io, data) => {
    io.use(function (socket, next) {
        const err = new Error();
        err.data = data;
        next(err);
    });
};

module.exports = {
    socketCon
};