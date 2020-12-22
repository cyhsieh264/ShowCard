const Studio = require('../models/studio_model');

const getUserCards = async (req, res) => {
    const userId = req.query.user;
    const { result, error } = await Studio.getUserCards(userId);
    let cards = [];
    result.map((card) => {
        const data = {
            id: card.id,
            title: card.title,
            picture: 'https://d20bzyreixm85i.cloudfront.net/' + card.picture,
            saved_at: card.saved_at
        };
        cards.push(data);
    })
    if (error) return res.status(500).json({ error: 'Internal server error' });
    return res.status(200).json({ data: { cards: cards } });
};

module.exports = {
    getUserCards
};