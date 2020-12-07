const Card = require('../models/card_model');
const jwt = require('jsonwebtoken');
const User = require('../models/user_model');
const { verifyToken } = require('../../util/util');

const socketJoin = async (socket) => { 
    console.log('a user connected');
    // 進db更改card資料
    const handshake = socket.handshake;
    socket.join(handshake.auth.room);
    socket.broadcast.in(handshake.auth.room).emit('join', [`${handshake.auth.username} join the room`, (new Date()).toLocaleString()])
    socket.on('input msg', (msg) => {
        socket.emit('message', [`You :  ${msg} `, (new Date()).toLocaleString()])
        socket.broadcast.in(handshake.auth.room).emit('message', [`${handshake.auth.username} :  ${msg} `, (new Date()).toLocaleString()])
    });

    socket.on('edit canvas', (canvas) => {
        socket.broadcast.emit('change canvas', canvas);
    });

    // socket.on('edit canvas', asyncCanvas);

    // socket.on('disconnect', leaveRoom);
    socket.on('disconnect', () => {
        console.log('user disconnected');
        // 進db更改card資料
        socket.broadcast.in(handshake.auth.room).emit('leave', [`${handshake.auth.username} leave the room`, (new Date()).toLocaleString()])
    });

};

const checkCard = async (req, res) => {
    const cardId = req.query.card;
    const { result, error } = await Card.check(cardId);
    if (error) return res.status(500).json({ error: 'Internal server error' });
    return res.status(200).json({ data: { existence: result } });
};

const createCard = async (req, res) => {
    // const canvas = req.body;
    // const data = {
    //     card_id: null,
    //     user_id: null,
    //     user_display_name: 'guest1',
    //     action: null,
    //     canvas: JSON.stringify(canvas),
    //     init: false
    // };
    // const { result, error } = await Card.save(data);
    // if (error) return res.status(500).json({ error: 'Internal server error' });
    // return res.status(200).json({ message: result });
};


module.exports = {
    socketJoin,
    checkCard,
    createCard,
};