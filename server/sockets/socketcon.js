const Card = require('../models/card_model');

const socketCon = (io) => {
    io.on('connection', (socket) => {
        console.log('a user connected');
        const handshake = socket.handshake;
        socket.join(handshake.auth.cid);
        socket.broadcast.in(handshake.auth.cid).emit('join', [`${handshake.auth.username} join the room`, (new Date()).toLocaleString()])
        socket.on('input msg', (msg) => {
            socket.emit('message', [`You :  ${msg} `, (new Date()).toLocaleString()])
            socket.broadcast.in(handshake.auth.cid).emit('message', [`${handshake.auth.username} :  ${msg} `, (new Date()).toLocaleString()])
        });
        socket.on('edit canvas', (canvas) => {
            socket.broadcast.in(handshake.auth.cid).emit('change canvas', canvas);
        });
        socket.on('disconnect', () => {
            console.log('user disconnected');
            Card.reduceMember(handshake.auth.cid);
            socket.broadcast.in(handshake.auth.cid).emit('leave', [`${handshake.auth.username} leave the room`, (new Date()).toLocaleString()])
        });
    });
};

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