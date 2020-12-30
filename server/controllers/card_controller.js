const Card = require('../models/card_model');

const checkCard = async (req, res) => {
    const cardId = req.query.card;
    const { result, error } = await Card.check(cardId);
    if (error) return res.status(500).json({ error: 'Internal server error' });
    return res.status(200).json({ data: result });
};

const enrollCard = async (req, res) => {
    const cardId = Math.random().toString(36).substring(2) + Date.now().toString(36).substring(4);
    const { result, error } = await Card.enroll(cardId);
    if (error) return res.status(500).json({ error: 'Internal server error' });
    return res.status(200).json({ data: { card: result.card } });
};

const createCard = async (req, res) => {
    const card = req.body;
    const time = Date.now();
    const data = {
        id: card.id,
        owner: card.owner,
        title: card.title,
        created_at: time,
        saved_at: time,
        shared: true,
        picture: `card_screenshot/${card.id}.jpg`
    };
    const { result, error } = await Card.create(data);
    if (error) return res.status(500).json({ error: 'Internal server error' });
    return res.status(200).json({ message: result });
};

const renameCard = async (req, res) => {
    const cardTitle = req.body.title;
    const cardId = req.body.card;
    const { result, error } = await Card.rename(cardTitle, cardId);
    if (error) return res.status(500).json({ error: 'Internal server error' });
    return res.status(200).json({ message: result });
};

const getTitle = async (req, res) => {
    const userId = req.query.user;
    const { result, error } = await Card.title(userId);
    if (error) return res.status(500).json({ error: 'Internal server error' });
    return res.status(200).json({ data: { title: result.title } });
};

module.exports = {
    checkCard,
    enrollCard,
    createCard,
    renameCard,
    getTitle
};