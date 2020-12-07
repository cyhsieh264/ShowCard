const Canvas = require('../models/canvas_model');

const initCanvas = async (req, res) => {
    const canvas = req.body;
    const data = {
        card_id: canvas.card_id,
        user_id: canvas.user_id,
        user_name: canvas.user_name,
        action: 'origin',
        canvas: JSON.stringify(canvas.canvas),
        init: true
    };
    const { result, error } = await Canvas.save(data);
    if (error) return res.status(500).json({ error: 'Internal server error' });
    return res.status(200).json({ message: result });
};

const saveCanvas = async (req, res) => {
    const canvas = req.body;
    const data = {
        card_id: canvas.card_id,
        user_id: canvas.user_id,
        user_name: canvas.user_name,
        action: canvas.action,
        canvas: JSON.stringify(canvas.canvas),
        init: false
    };
    const { result, error } = await Canvas.save(data);
    if (error) return res.status(500).json({ error: 'Internal server error' });
    return res.status(200).json({ message: result });
};

const checkCanvas = async (req, res) => {
    const cardId = req.query.card;
    const { result, error } = await Canvas.check(cardId);
    if (error) return res.status(500).json({ error: 'Internal server error' });
    return res.status(200).json({ data: { existence: result } });
};

const loadCanvas = async (req, res) => {
    const cardId = req.query.card;
    const { result, error } = await Canvas.load(cardId);
    if (error) return res.status(500).json({ error: 'Internal server error' });
    return res.status(200).json({ data: { step: result } });
};

const undoCanvas = async (req, res) => {
    const data = req.body;
    const { result, error } = await Canvas.undo(data.card_id, data.user_id);
    if (error) {
        if (error.customError) return res.status(403).json({ error: error.customError });
        return res.status(500).json({ error: 'Internal server error' });
    }
    return res.status(200).json({ data: { step: result } });
};

const redoCanvas = async (req, res) => {
    const data = req.body;
    const { result, error } = await Canvas.redo(data.card_id, data.user_id);
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

