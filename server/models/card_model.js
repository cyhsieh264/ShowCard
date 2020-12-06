const { query, transaction, commit, rollback } = require('./mysqlcon');
const { writeLog } = require('../../util/util');

const create = async(data) => {
    // try {
    //     await transaction();
    //     const result = await query('INSERT INTO `user` SET ?', data);
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

module.exports = {
    create,
};