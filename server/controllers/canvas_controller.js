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
    return res.status(200).json({ message: message });
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
    const { message, error } = await Card.save(data);
    if (error) {
        const { stack } = error;
        writeLog({ stack });
        return res.status(500).json({ error: 'Database query error' });
    }
    return res.status(200).json({ message: message });
};

const checkCanvas = async (req, res) => {
    const { result, error } = await Card.check();
    if (error) {
        const { stack } = error;
        writeLog({ stack });
        return res.status(500).json({ error: 'Database query error' });
    }
    return res.status(200).json({ data: { count: result } });
};

const loadCanvas = async (req, res) => {
    const { result, error } = await Card.load();
    if (error) {
        const { stack } = error;
        writeLog({ stack });
        return res.status(500).json({ error: 'Database query error' });
    }
    return res.status(200).json({ data: { step: result } });
};

const undoCanvas = async (req, res) => {
    const { result, message, error } = await Card.undo();
    if (message) return res.status(200).json({ message: message });
    if (error) {
        const { stack } = error;
        writeLog({ stack });
        return res.status(500).json({ error: 'Database query error' });
    }
    return res.status(200).json({ data: { step: result } });
};

const redoCanvas = async (req, res) => {
    const { result, message, error } = await Card.redo();
    if (message) return res.status(200).json({ message: message });
    if (error) {
        const { stack } = error;
        writeLog({ stack });
        return res.status(500).json({ error: 'Database query error' });
    }
    return res.status(200).json({ data: { step: result } });
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

