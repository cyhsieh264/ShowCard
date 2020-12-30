const { query, transaction, commit, rollback } = require('./mysqlcon');
const { writeLog } = require('../../util/util');

const getAssets = async (category) => {
    try {
        const result = await query('SELECT `title`, `file_format` AS `format`, `width`, `height`, `left_position` AS `left`, `top_position` AS `top` FROM `asset` WHERE `category` = ? ', category);
        return { result: result };
    } catch (error) {
        writeLog(error.stack);
        return { error }
    }
};

module.exports = {
    getAssets
};