const { query, transaction, commit, rollback } = require('./mysqlcon');

const check = async() => {
    return await query('SELECT COUNT(`user_display_name`) FROM `canvas_done` WHERE `user_display_name` = ?', 'guest1');
};

const signup = async(data) => {
    try {
        await transaction();
        await query('INSERT INTO `user` SET ?', data);
        await commit();
        return { message: 'Query Success' };
    } catch (error) {
        await rollback();
        return { error };
    }
};

module.exports = {
    signup,
    // signin,
    // checkExistence,
};