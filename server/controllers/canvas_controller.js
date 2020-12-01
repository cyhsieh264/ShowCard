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
    await Card.save(data);
    res.status(200).json({ message: 'save canvas' });
    return;
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
    res.status(200).json({ message: 'save canvas' });
    return;
};

const checkCanvas = async (req, res) => {
    const data = ((await Card.check())[0])['COUNT(`user_display_name`)'];
    res.status(200).json({ data: { count: data } });
    return;
};

const loadCanvas = async (req, res) => {
    const data = await Card.load();
    res.status(200).json({ data: { step: data } });
    return;
};

const undoCanvas = async (req, res) => {
    const data = await Card.undo();
    if (!data || data.error) {
        res.status(200).json({ message: 'Already the last step' }); 
        return;
    }
    res.status(200).json({ data: { step: data } });
    return;
};

const redoCanvas = async (req, res) => {
    const data = await Card.redo();
    if (!data || data.error) {
        res.status(200).json({ message: 'Already the last step' }); 
        return;
    }
    res.status(200).json({ data: { step: data } });
    return;
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

