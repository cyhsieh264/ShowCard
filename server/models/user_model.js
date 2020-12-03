const { query, transaction, commit, rollback } = require('./mysqlcon');
const { writeLog } = require('../../util/util');

const signup = async(data) => {
    try {
        await transaction();
        await query('INSERT INTO `user` SET ?', data);
        await commit();
        return { result: 'Success' };
    } catch (error) {
        if (error.code == 'ER_DUP_ENTRY') {
            let customError;
            if (error.sqlMessage.includes('username')) {
                customError = 'Username already exists, please try another one';
            } else if (error.sqlMessage.includes('email')) {
                customError = 'Email already exists, please try another one';
            }
            await rollback();
            return { error: { customError: customError } };
        }
        await rollback();
        writeLog(error.stack);
        return { error };
    }
};

const signin = async(user) => {
    try {
        return { result: (await query('SELECT `username`, `email`, `password` FROM `user` WHERE `username` = ? OR `email` = ?', [user, user]))[0] };
    } catch (error) {
        return { error };
    }
};

const check = async() => {
    try {
        return { result: (await query('SELECT * FROM `canvas_done` WHERE `user_display_name` = ? ORDER BY `id` DESC LIMIT 1', 'guest1'))[0] };
    } catch (error) {
        return { error }
    }
};

module.exports = {
    signup,
    signin,
    // check
};