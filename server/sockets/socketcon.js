const Card = require('../models/card_model');

const socketCon = (io) => {
    io.on('connection', (socket) => {
        const handshake = socket.handshake;
        socket.join(handshake.auth.cid);
        socket.broadcast.in(handshake.auth.cid).emit('join', `${handshake.auth.username}   Has Joined The Room`);
        socket.on('input msg', (msg) => {
            socket.broadcast.in(handshake.auth.cid).emit('message', [handshake.auth.username, msg]);
        });
        socket.on('rename card', (title) => {
            socket.broadcast.in(handshake.auth.cid).emit('change title', title);
        })
        socket.on('edit canvas', (canvas) => {
            socket.broadcast.in(handshake.auth.cid).emit('change canvas', canvas);
        });
        socket.on('disconnect', () => {
            Card.reduceMember(handshake.auth.cid);
            socket.broadcast.in(handshake.auth.cid).emit('leave', `${handshake.auth.username}  Left The Room`);
        });
    });
};

module.exports = {
    socketCon
};