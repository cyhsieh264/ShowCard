const { query, transaction, commit, rollback } = require('./mysqlcon');
const { writeLog } = require('../../util/util');

const getUserCards = async(userId) => {
    try {
        const result = await query('SELECT * FROM `card` WHERE `owner` = ?', userId);
        return { result: result };
    } catch (error) {
        writeLog(error.stack);
        return { error }
    }
};

module.exports = {
    getUserCards
};