const Canvas = require('../models/canvas_model');
// const jwt = require('jsonwebtoken');
// const User = require('../models/user_model');
const { verifyToken } = require('../../util/util');

// const joinRoom = async (socket) => { 
//     // console.log('a user connected');
//     const handshake = socket.handshake;
//     socket.join(handshake.auth.room);
//     socket.broadcast.in(handshake.auth.room).emit('join', [`${handshake.auth.username} join the room`, (new Date()).toLocaleString()])
//     socket.on('input msg', (msg) => {
//         socket.emit('message', [`You :  ${msg} `, (new Date()).toLocaleString()])
//         socket.broadcast.in(handshake.auth.room).emit('message', [`${handshake.auth.username} :  ${msg} `, (new Date()).toLocaleString()])
//     })

//     socket.on('edit canvas', (canvas) => {
//         socket.broadcast.emit('change canvas', canvas);
//     })

//     // socket.on('edit canvas', asyncCanvas);

//     // socket.on('disconnect', leaveRoom);
//     socket.on('disconnect', () => {
//         console.log('user disconnected');
//         socket.broadcast.in(handshake.auth.room).emit('leave', [`${handshake.auth.username} leave the room`, (new Date()).toLocaleString()])
//     });

// }

// const asyncCanvas = async (canvas) => {
//     socket.broadcast.emit('change canvas', canvas);
// };

// const sendMessage = async (msg) => {
//     socket.emit('message', [`You :  ${msg} `, (new Date()).toLocaleString()])
//     socket.broadcast.emit('message', [`${user} :  ${msg} `, (new Date()).toLocaleString()])
// }

// const leaveRoom = async () => {
//     // 從room的名單中移除user
//     console.log('user disconnected');
// }


const initCanvas = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
    const user = await verifyToken(token);
    if (!user) return res.status(403).json( { error: 'Invalid user token' } );
    const canvas = req.body;
    const data = {
        card_id: null,
        user_id: user.id,
        user_name: user.name,
        action: null,
        canvas: JSON.stringify(canvas),
        init: true
    };
    const { result, error } = await Canvas.save(data);
    if (error) return res.status(500).json({ error: 'Internal server error' });
    return res.status(200).json({ message: result });

    
    // const canvas = req.body;
    // const data = {
    //     card_id: null,
    //     user_id: null,
    //     user_name: 'guest1',
    //     action: null,
    //     canvas: JSON.stringify(canvas),
    //     init: true
    // };
    // const { result, error } = await Card.save(data);
    // if (error) return res.status(500).json({ error: 'Internal server error' });
    // return res.status(200).json({ message: result });
};

const saveCanvas = async (req, res) => {
    const canvas = req.body;
    const data = {
        card_id: null, // 如何取得？
        user_id: null,
        user_display_name: 'guest1',
        action: null,
        canvas: JSON.stringify(canvas),
        init: false
    };
    const { result, error } = await Canvas.save(data);
    if (error) return res.status(500).json({ error: 'Internal server error' });
    return res.status(200).json({ message: result });
};

const checkCanvas = async (req, res) => {
    const { result, error } = await Canvas.check();
    if (error) return res.status(500).json({ error: 'Internal server error' });
    return res.status(200).json({ data: { count: result } });
};

const loadCanvas = async (req, res) => {
    const { result, error } = await Canvas.load();
    if (error) return res.status(500).json({ error: 'Internal server error' });
    return res.status(200).json({ data: { step: result } });
};

const undoCanvas = async (req, res) => {
    const { result, error } = await Canvas.undo();
    if (error) {
        if (error.customError) return res.status(403).json({ error: error.customError });
        return res.status(500).json({ error: 'Internal server error' });
    }
    return res.status(200).json({ data: { step: result } });
};

const redoCanvas = async (req, res) => {
    const { result, error } = await Canvas.redo();
    if (error) {
        if (error.customError) return res.status(403).json({ error: error.customError });
        return res.status(500).json({ error: 'Internal server error' });
    }
    return res.status(200).json({ data: { step: result } });
};

module.exports = {
    initCanvas,
    saveCanvas,
    checkCanvas,
    loadCanvas,
    undoCanvas,
    redoCanvas
};

// new column for tracking room users

