const Card = require('../models/card_model');
const { writeLog } = require('../../util/util');

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
    redoCanvas
};

// new column for tracking room users

