const Card = require('../models/card_model');
const { writeLog } = require('../../util/util');

const saveInitCanvas = async (req, res) => {
    const canvas = req.body;
    const data = {
        card_id: null,
        user_id: null,
        user_display_name: 'guest1',
        action: null,
        canvas: JSON.stringify(canvas),
        init: true
    };
    const { error, message } = await Card.save(data);
    if (error) {
        writeLog({ error });
        return error
    } 
    return res.status(200).json({ message: 'save canvas' });
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
    await Card.save(data);
    return res.status(200).json({ message: 'save canvas' });
};

const checkCanvas = async (req, res) => {
    const data = ((await Card.check())[0])['COUNT(`user_display_name`)'];
    return res.status(200).json({ data: { count: data } });
};

const loadCanvas = async (req, res) => {
    const data = await Card.load();
    return res.status(200).json({ data: { step: data } });
};

const undoCanvas = async (req, res) => {
    const data = await Card.undo();
    if (!data || data.error) {
        res.status(200).json({ message: 'Already the last step' }); 
        return;
    }
    return res.status(200).json({ data: { step: data } });
};

const redoCanvas = async (req, res) => {
    const data = await Card.redo();
    if (!data || data.error) {
        return res.status(200).json({ message: 'Already the last step' }); 
    }
    return res.status(200).json({ data: { step: data } });
};

module.exports = {
    saveInitCanvas,
    saveCanvas,
    checkCanvas,
    loadCanvas,
    undoCanvas,
    redoCanvas
};

// new column for tracking room users

