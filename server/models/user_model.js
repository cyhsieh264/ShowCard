const { query, transaction, commit, rollback } = require('./mysqlcon');

const signup = async(data) => {
    try {
        await transaction();
        const result = await query('INSERT INTO `user` SET ?', data);
        await commit();
        return { message: 'Success' };
    } catch (error) {
        if (error.code == 'ER_DUP_ENTRY') {
            let message = ''
            if (error.sqlMessage.includes('username')) {
                message = 'Username already exists, please try another one';
            } else if (error.sqlMessage.includes('email')) {
                message = 'Email already exists, please try another one';
            }
            await rollback();
            return { message: message };
        }
        await rollback();
        return { error };
    }
};

const signin = async(data) => {
    try {
        await transaction();
        const password = (await query('SELECT `password` FROM `user` WHERE `username` = ? OR `email` = ?', [data.user, data.user]))[0].password;

        await commit();
        return { message: 'Success' };
    } catch (error) {
        await rollback();
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