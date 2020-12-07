const { query, transaction, commit, rollback } = require('./mysqlcon');
const { writeLog } = require('../../util/util');

const create = async(data) => {
    try {
        await transaction();
        await query('INSERT INTO `card` SET ?', data);
        await commit();
        return { result: 'Success' };
    } catch (error) {
        await rollback();
        writeLog(error.stack);
        return { error };
    }
};

const check = async(cardId) => {
    try {
        const result = await query('SELECT 1 FROM `card` WHERE `id` = ? LIMIT 1', cardId);
        if (result.length == 0) return { result: false };
        else return { result: true };
    } catch (error) {
        writeLog(error.stack);
        return { error }
    }
};

const addMember = async(cardId) => {
    try {
        await transaction();
        await query('UPDATE `card` SET `member_count` = (`member_count` + 1) WHERE `id` = ?', cardId);
        const result = (await query('SELECT `member_count` FROM `card` WHERE `id` = ?', cardId))[0].member_count;
        await commit();
        return { result: result };
    } catch (error) {
        await rollback();
        writeLog(error.stack);
        return { error }
    }
};

const reduceMember = async(cardId) => {
    try {
        await transaction();
        await query('UPDATE `card` SET `member_count` = (`member_count` - 1) WHERE `id` = ?', cardId);
        await commit();
        return { result: 'Success' };
    } catch (error) {
        await rollback();
        writeLog(error.stack);
        return { error }
    }
};


module.exports = {
    create,
    check,
    addMember,
    reduceMember
};