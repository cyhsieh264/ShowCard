require('dotenv').config();
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_STORAGE_BUCKET_NAME, AWS_REGION } = process.env;
const Canvas = require('../models/canvas_model');
const aws = require('aws-sdk');

const saveCanvas = async (req, res) => {
    const canvas = req.body;
    const data = {
        card_id: canvas.card_id,
        user_id: canvas.user_id,
        action: canvas.action,
        obj_id: canvas.obj_id,
        obj_type: canvas.obj_type, 
        object: canvas.object
    };
    const { result, error } = await Canvas.save(data);
    if (error) return res.status(500).json({ error: 'Internal server error' });
    return res.status(200).json({ message: result });
};

const uploadScreenshot = async (req, res) => {
    const canvas = req.body;
    aws.config.update({
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
        accessKeyId: AWS_ACCESS_KEY_ID,
        region: AWS_REGION
    });
    const screenshot = canvas.screenshot;
    if (screenshot) {
        const s3 = new aws.S3();
        const base64Data = new Buffer.from(screenshot.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        const params = {
            Bucket: AWS_STORAGE_BUCKET_NAME,
            Key: 'card_screenshot/' + canvas.card + '.jpg',
            Body: base64Data,
            ACL: 'public-read',
            ContentEncoding: 'base64', 
            ContentType: 'image/jpeg' 
        };
        s3.putObject(params, (err, data) => {
            if (err) res.status(400).json({ data: { message: 'Screenshot Upload Failed' } });
        });
    }
    return res.status(200).json({ data: { message: 'Success' } });
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
    uploadScreenshot,
    checkCanvas,
    loadCanvas,
    undoCanvas,
    redoCanvas
};