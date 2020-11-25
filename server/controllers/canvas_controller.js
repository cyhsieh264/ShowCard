const Board = require('../models/canvas_model');
const { writeLog } = require('../../util/util');

const test = async (req, res) => {
    res.status(200).json({ data: 'canvas test info' });
};

module.exports = {
    test,
}