const { query, transaction, commit, rollback } = require('./mysqlcon');
const { writeLog } = require('../../util/util');

const check = async(cardId) => {
    try {
        const result = await query('SELECT * FROM `card` WHERE `id` = ? LIMIT 1', cardId);
        if (result.length == 0) return { result: { existence: false } };
        let username;
        if (result[0].owner) username = (await query('SELECT `name` FROM `user` WHERE `id` = ?', result[0].owner))[0].name;
        else username = null;
        if (result.length == 0) return { result: { existence: false } };
        else return { result: { existence: true, owner: result[0].owner, ownername: username, title: result[0].title } };
    } catch (error) {
        writeLog(error.stack);
        return { error }
    }
};

const title = async(userId) => {
    try {
        const result = await query('SELECT * FROM `card` WHERE `owner` = ? AND `title` LIKE ? \'%\'', [userId, 'Untitled']);
        if (result.length == 0) return { result: { title: 'Untitled' } };
        else return { result: { title: 'Untitled' + (result.length + 1).toString() } };
    } catch (error) {
        writeLog(error.stack);
        return { error }
    }
}

const enroll = async(cardId) => {
    try {
        await transaction();
        await query('INSERT INTO `card` (`id`) VALUES (?)', cardId);
        await commit();
        return { result: { card: cardId } };
    } catch (error) {
        await rollback();
        writeLog(error.stack);
        return { error };
    }
};

const create = async(data) => {
    try {
        await transaction();
        await query('UPDATE `card` SET `owner` = ?, `title` = ?, `created_at` = ?, `saved_at` = ?, `shared` = ?, `picture` = ? WHERE `id` = ?', [data.owner, data.title, data.created_at, data.saved_at, data.shared, data.picture, data.id]);
        await commit();
        return { result: 'Success' };
    } catch (error) {
        await rollback();
        writeLog(error.stack);
        return { error };
    }
};

const rename = async(cardTitle, cardId) => {
    try {
        await transaction();
        await query('SELECT `title` FROM `card` WHERE `id` = ? FOR UPDATE', cardId);
        await query('UPDATE `card` SET `title` = ? WHERE `id` = ?', [cardTitle, cardId]);
        await commit();
        return { result: 'Success' };
    } catch (error) {
        await rollback();
        writeLog(error.stack);
        return { error }
    }
}

module.exports = {
    check,
    title,
    enroll,
    create,
    rename
};