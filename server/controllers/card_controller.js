const Board = require('../models/card_model');
const { writeLog } = require('../../util/util');

const test = async (req, res) => {
    res.status(200).json({ data: 'card test info' });
};

module.exports = {
    test,
}