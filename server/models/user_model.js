const { query, transaction, commit, rollback } = require('./mysqlcon');
const { writeLog } = require('../../util/util');

const signup = async(data) => {
    try {
        await transaction();
        const result = await query('INSERT INTO `user` SET ?', data);
        await commit();
        return { result: result };
    } catch (error) {
        if (error.code == 'ER_DUP_ENTRY') {
            let customError;
            if (error.sqlMessage.includes('email')) {
                customError = 'Email already exists, please try another one';
            }
            await rollback();
            writeLog(error.stack);
            return { error: { customError: customError } };
        }
        await rollback();
        writeLog(error.stack);
        return { error };
    }
};

const signin = async(email) => {
    try {
        const result = await query('SELECT `id`, `email`, `name`, `password` FROM `user` WHERE `email` = ?', email);
        if (result.length == 0) return { error: { customError: 'Incorrect email or password' } }
        return { result: result[0] };
    } catch (error) {
        writeLog(error.stack);
        return { error };
    }
};

module.exports = {
    signup,
    signin
};