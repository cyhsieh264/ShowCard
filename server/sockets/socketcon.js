const socketCon = (io) => {
    io.on('connection', (socket) => {   // 相當於 function x (socket) {}
        console.log('a user connected');
        const user = socket.id
        // const msg = 'Welcome!'
        // socket.emit('message', [`${user} :  ${msg} `, (new Date()).toLocaleString()]);
        socket.on('input msg', (msg) => {
            socket.emit('message', [`You :  ${msg} `, (new Date()).toLocaleString()])
            socket.broadcast.emit('message', [`${user} :  ${msg} `, (new Date()).toLocaleString()])
        })
        socket.on('edit canvas', (canvas) => {
            socket.broadcast.emit('change canvas', canvas);
        })
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
}

// const errorHandling = (io, data) => {
//     io.use(function (socket, next) {
//         const err = new Error();
//         err.data = data;
//         next(err);
//     });
// };

module.exports = {
    socketCon
};