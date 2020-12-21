const { query, transaction, commit, rollback } = require('./mysqlcon');
const { writeLog } = require('../../util/util');

const check = async(cardId) => {
    try {
        const result = await query('SELECT * FROM `card` WHERE `id` = ? LIMIT 1', cardId);
        if (result.length == 0) return { result: { existence: false } };
        else return { result: { existence: true, owner: result[0].owner, title: result[0].title } };
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
        await query('UPDATE `card` SET `owner` = ?, `title` = ?, `created_at` = ?, `saved_at` = ?, `shared` = ?, `member_count` = ?, `picture` = ? WHERE `id` = ?', [data.owner, data.title, data.created_at, data.saved_at, data.shared, data.member_count, data.picture, data.id]);
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

const addMember = async(cardId) => {
    try {
        await transaction();
        await query('SELECT `member_count` FROM `card` WHERE `id` = ? FOR UPDATE', cardId)
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
        await query('SELECT `member_count` FROM `card` WHERE `id` = ? FOR UPDATE', cardId)
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
    check,
    title,
    enroll,
    create,
    rename,
    addMember,
    reduceMember
};