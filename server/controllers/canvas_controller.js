const Card = require('../models/card_model');
const jwt = require('jsonwebtoken');
const User = require('../models/user_model');
const { verifyToken } = require('../../util/util');

const joinRoom = async (socket) => {  // 針對每一位user的操作包（一個socket進來時）
    console.log('a user connected');
    // console.log(socket.handshake);

    socket.on('check user', (info) => {
        console.log(info)
        socket.join(info[0])
    })

    // const user = socket.id
    // console.log(user)

    // get parameter if not generate room id
    // socket.join(room);
    
    // const msg = 'Welcome!'
    // socket.emit('message', [`${user} :  ${msg} `, (new Date()).toLocaleString()]);
    socket.on('input msg', (msg) => {
        socket.emit('message', [`You :  ${msg} `, (new Date()).toLocaleString()])
        socket.broadcast.emit('message', [`${user} :  ${msg} `, (new Date()).toLocaleString()])
    })

    socket.on('edit canvas', (canvas) => {
        socket.broadcast.emit('change canvas', canvas);
    })

    // socket.on('edit canvas', asyncCanvas);

    socket.on('disconnect', leaveRoom);
    // socket.on('disconnect', () => {
    //     console.log('user disconnected');
    // });

}

// const asyncCanvas = async (canvas) => {
//     socket.broadcast.emit('change canvas', canvas);
// };

// const sendMessage = async (msg) => {
//     socket.emit('message', [`You :  ${msg} `, (new Date()).toLocaleString()])
//     socket.broadcast.emit('message', [`${user} :  ${msg} `, (new Date()).toLocaleString()])
// }

const leaveRoom = async () => {
    // 從room的名單中移除user
    console.log('user disconnected');
}


const initCanvas = async (req, res) => {
    const canvas = req.body;
    const data = {
        card_id: null,
        user_id: null,
        user_display_name: 'guest1',
        action: null,
        canvas: JSON.stringify(canvas),
        init: true
    };
    const { result, error } = await Card.save(data);
    if (error) return res.status(500).json({ error: 'Internal server error' });
    return res.status(200).json({ message: result });
};

const saveCanvas = async (req, res) => {
    const canvas = req.body;
    const data = {
        card_id: null,
        user_id: null,
        user_display_name: 'guest1',
        action: null,
        canvas: JSON.stringify(canvas),
        init: false
    };
    const { result, error } = await Card.save(data);
    if (error) return res.status(500).json({ error: 'Internal server error' });
    return res.status(200).json({ message: result });
};

const checkCanvas = async (req, res) => {
    const { result, error } = await Card.check();
    if (error) return res.status(500).json({ error: 'Internal server error' });
    return res.status(200).json({ data: { count: result } });
};

const loadCanvas = async (req, res) => {
    const { result, error } = await Card.load();
    if (error) return res.status(500).json({ error: 'Internal server error' });
    return res.status(200).json({ data: { step: result } });
};

const undoCanvas = async (req, res) => {
    const { result, error } = await Card.undo();
    if (error) {
        if (error.customError) return res.status(403).json({ error: error.customError });
        return res.status(500).json({ error: 'Internal server error' });
    }
    return res.status(200).json({ data: { step: result } });
};

const redoCanvas = async (req, res) => {
    const { result, error } = await Card.redo();
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
    redoCanvas,
    joinRoom,
};

// new column for tracking room users

