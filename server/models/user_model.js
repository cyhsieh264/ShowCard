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

const nativeSignin = async(email) => {
    try {
        const result = await query('SELECT `id`, `email`, `name`, `password` FROM `user` WHERE `email` = ?', email);
        if (result.length == 0) return { error: { customError: 'Email does not exist' } }
        return { result: result[0] };
    } catch (error) {
        writeLog(error.stack);
        return { error };
    }
};

const googleSignin = async(userInfo) => {
    try {
        const queryResult = await query('SELECT `id`, `email`, `name` FROM `user` WHERE `email` = ?', userInfo.email);
        if (queryResult.length == 0) {
            const data = {
                provider: 'google',
                email: userInfo.email,
                name: userInfo.name,
                password: null,
                created_at: Date.now(),
                active: true
            };
            const { result, error } = await signup(data);
            if (error) return {error: 'Sign in failed'};
            return { result: { id: result.insertId, email: userInfo.email, name: userInfo.name } };
        } else {
            return { result: queryResult[0] };
        }
    } catch (error) {
        writeLog(error.stack);
        return { error };
    }
};

module.exports = {
    signup,
    nativeSignin,
    googleSignin
};