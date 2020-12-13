const Canvas = require('../models/canvas_model');

const saveCanvas = async (req, res) => {
    const canvas = req.body;
    const data = {
        card_id: canvas.card_id,
        user_id: canvas.user_id,
        action: canvas.action,
        obj_id: canvas.obj_id,
        obj_type: canvas.obj_type, 
        object: canvas.object,  // 注意json進出的格式
    };
    const { result, error } = await Canvas.save(data);
    if (error) return res.status(500).json({ error: 'Internal server error' });
    return res.status(200).json({ message: result });
};

const checkCanvas = async (req, res) => { 
    const data = req.query;
    const { result, error } = await Canvas.check(data.card, data.user);
    if (error) return res.status(500).json({ error: 'Internal server error' });
    return res.status(200).json({ data: { existence: result } });
};

const loadCanvas = async (req, res) => {
    const cardId = req.query.card;
    const { result, error } = await Canvas.load(cardId);
    if (error) return res.status(500).json({ error: 'Internal server error' });
    return res.status(200).json({ data: { step: [ { action: 'create', object: result } ] } });
};

const undoCanvas = async (req, res) => {
    const data = req.query;
    const { result, error } = await Canvas.undo(data.card, data.user);
    if (error) {
        if (error.customError) return res.status(403).json({ error: error.customError });
        return res.status(500).json({ error: 'Internal server error' });
    }
    return res.status(200).json({ data: { step: result } });
};

const redoCanvas = async (req, res) => {
    const data = req.query;
    const { result, error } = await Canvas.redo(data.card, data.user);
    if (error) {
        if (error.customError) return res.status(403).json({ error: error.customError });
        return res.status(500).json({ error: 'Internal server error' });
    }
    return res.status(200).json({ data: { step: result } });
};

module.exports = {
    saveCanvas,
    checkCanvas,
    loadCanvas,
    undoCanvas,
    redoCanvas
};