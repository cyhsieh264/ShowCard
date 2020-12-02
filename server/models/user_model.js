const { query, transaction, commit, rollback } = require('./mysqlcon');

const check = async() => {
    return await query('SELECT COUNT(`user_display_name`) FROM `canvas_done` WHERE `user_display_name` = ?', 'guest1');
};

// const signUp = async(data) => {
//     try {
//         await transaction();
//         await query('INSERT INTO `canvas_done` SET ?', data);
//         await query('DELETE FROM `canvas_undo` WHERE `user_display_name` = ?', data.user_display_name);
//         await commit();
//         return true;
//     } catch (error) {
//         await rollback();
//         return { error };
//     }
// };

module.exports = {
    signUp,
    signIn,
    checkExistence,
};