const Card = require('../models/card_model');
const { writeLog } = require('../../util/util');

const saveCanvas = async (req, res) => {
    const canvas = req.body;
    const data = {
        card_id: null,
        user_id: null,
        user_display_name: 'guest1',
        action: null,
        canvas: JSON.stringify(canvas)
    };
    await Card.save(data);
    res.status(200).json({ data: 'save canvas' });
    return;
};

const undoCanvas = async (req, res) => {
    const data = await Card.undo();
    if (!data || data.error) {
        res.status(200).json({ message: 'Already the last step'}); 
        return;
    }
    res.status(200).json({ data: data });
    return;
};

const redoCanvas = async (req, res) => {
    const data = await Card.redo();
    if (!data || data.error) {
        res.status(200).json({ message: 'Already the last step'}); 
        return;
    }
    res.status(200).json({ data: data });
    return;
};

const ifUndo = async (req, res) => {
    // const data = await Card.redo();
    res.status(200).json({ data: 'new api?' });
    return;
};

module.exports = {
    saveCanvas,
    undoCanvas,
    redoCanvas
};

// new column for tracking room users

