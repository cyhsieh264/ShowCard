const { query, transaction, commit, rollback } = require('./mysqlcon');
const { writeLog } = require('../../util/util');

const save = async(data) => {
    try {
        const time = Date.now();
        await transaction();
        await query('INSERT INTO `canvas_done` SET ?', data);
        await query('DELETE FROM `canvas_undo` WHERE `card_id` = ? AND `user_id` = ?', [data.card_id, data.user_id]);
        await query('UPDATE `card` SET `saved_at` = ? WHERE `id` = ?', [time, data.card_id]);
        await commit();
        return { result: 'Success' };
    } catch (error) {
        await rollback();
        writeLog(error.stack);
        return { error };
    }
};

const check = async(card, user) => {
    try {
        const result = await query('SELECT 1 FROM `canvas_done` WHERE `card_id` = ? AND `user_id` = ? LIMIT 1', [card, user]);
        if (result.length == 0) return { result: false };
        else return { result: true };
    } catch (error) {
        writeLog(error.stack);
        return { error }
    }
};

const load = async(cardId) => {
    try {
        return { result: (await query('SELECT * FROM `canvas_done` WHERE `card_id` = ? ORDER BY `id` DESC LIMIT 1', cardId))[0] };
    } catch (error) {
        writeLog(error.stack);
        return { error }
    }
};

const undo = async(card, user) => {
    const time = Date.now();
    try {
        await transaction();
        const lastStep = (await query('SELECT * FROM `canvas_done` WHERE `card_id` = ? AND `user_id` = ? ORDER BY `id` DESC LIMIT 1', [card, user]))[0];
        if (lastStep.init == true) {
            await commit();
            return { error: { customError: 'Already the last step' } };
        }
        const data = {
            card_id: lastStep.card_id,
            user_id: lastStep.user_id,
            user_name: lastStep.user_name,
            action: lastStep.action,
            canvas: lastStep.canvas,
            init: lastStep.init
        };
        await query('INSERT INTO `canvas_undo` SET ?', data);
        await query('DELETE FROM `canvas_done` WHERE `id` = ?', lastStep.id);
        const step = await query('SELECT * FROM `canvas_done` WHERE `card_id` = ? AND `user_id` = ? ORDER BY `id` DESC LIMIT 1', [card, user]);
        await query('UPDATE `card` SET `saved_at` = ? WHERE `id` = ?', [time, data.card_id]);
        await commit();
        return { result: step[0] };
    } catch (error) {
        await rollback();
        writeLog(error.stack);
        return { error };
    }
};

const redo = async(card, user) => {
    const time = Date.now();
    try {
        await transaction();
        const formerStep = (await query('SELECT * FROM `canvas_undo` WHERE `card_id` = ? AND `user_id` = ? ORDER BY `id` DESC LIMIT 1', [card, user]))[0];
        if (!formerStep) {
            await commit();
            return { error: { customError: 'Already the last step' } };
        }
        const data = {
            card_id: formerStep.card_id,
            user_id: formerStep.user_id,
            user_name: formerStep.user_name,
            action: formerStep.action,
            canvas: formerStep.canvas,
            init: formerStep.init
        };
        await query('INSERT INTO `canvas_done` SET ?', data);
        await query('DELETE FROM `canvas_undo` WHERE `id` = ?', formerStep.id);
        const step = await query('SELECT * FROM `canvas_done` WHERE `card_id` = ? AND `user_id` = ? ORDER BY `id` DESC LIMIT 1', [card, user]);
        await query('UPDATE `card` SET `saved_at` = ? WHERE `id` = ?', [time, data.card_id]);
        await commit();
        return { result: step[0] };
    } catch (error) {
        await rollback();
        writeLog(error.stack);
        return { error };
    }
};

module.exports = {
    save,
    check,
    load,
    undo,
    redo
};