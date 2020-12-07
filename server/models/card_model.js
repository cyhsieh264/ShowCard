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

    // try {
    //     await transaction();
    //     const result = await query('INSERT INTO `card` SET ?', data);
    //     await commit();
    //     return { result: result };
    // } catch (error) {
    //     if (error.code == 'ER_DUP_ENTRY') {
    //         let customError;
    //         if (error.sqlMessage.includes('email')) {
    //             customError = 'Email already exists, please try another one';
    //         }
    //         await rollback();
    //         writeLog(error.stack);
    //         return { error: { customError: customError } };
    //     }
    //     await rollback();
    //     writeLog(error.stack);
    //     return { error };
    // }
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

module.exports = {
    create,
    check
};