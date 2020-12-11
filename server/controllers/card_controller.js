const Card = require('../models/card_model');

const checkCard = async (req, res) => {
    const cardId = req.query.card;
    const { result, error } = await Card.check(cardId);
    if (error) return res.status(500).json({ error: 'Internal server error' });
    return res.status(200).json({ data: { existence: result.existence, owner: result.owner } });
};

const createCard = async (req, res) => {
    const card = req.body;
    const data = {
        id: card.id,
        owner: card.owner,
        title: card.title,
        created_at: Date.now(),
        saved_at: Date.now(),
        shared: true,
        member_count: 1,
        picture: null
    };
    const { result, error } = await Card.create(data);
    if (error) return res.status(500).json({ error: 'Internal server error' });
    return res.status(200).json({ message: result });
};

const addMember = async (req, res) => {
    const cardId = req.body.card;
    const { result, error } = await Card.addMember(cardId);
    if (error) return res.status(500).json({ error: 'Internal server error' });
    return res.status(200).json({ data: { count: result } });
};

module.exports = {
    checkCard,
    createCard,
    addMember
};