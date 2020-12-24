const { query, transaction, commit, rollback } = require('./mysqlcon');
const { writeLog } = require('../../util/util');

const save = async(data) => {
    const time = Date.now();
    try {
        await transaction();
        if (data.action == 'modify') {
            const existence = await query('SELECT 1 FROM `canvas_done` WHERE `card_id` = ? AND `user_id` = ? AND `obj_id` = ? LIMIT 1', [data.card_id, data.user_id, data.obj_id]);
            if (existence.length == 0) {
                const lastStatus = (await query('SELECT * FROM `canvas_done` WHERE `card_id` = ? AND `obj_id` = ? ORDER BY `id` DESC LIMIT 1', [data.card_id, data.obj_id]))[0];
                const recreateStatus = {
                    card_id: data.card_id,
                    user_id: data.user_id,
                    action: 'recreate',
                    obj_id: lastStatus.obj_id,
                    obj_type: lastStatus.obj_type,
                    object: lastStatus.object,
                    is_background: data.is_background
                };
                await query('INSERT INTO `canvas_done` SET ?', recreateStatus);
            }
        }
        await query('INSERT INTO `canvas_done` SET ?', data);
        await query('DELETE FROM `canvas_undo` WHERE `card_id` = ? AND `obj_id` = ?', [data.card_id, data.obj_id]);
        await query('SELECT `saved_at` FROM `card` WHERE `id` = ? FOR UPDATE', data.card_id);
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
        const res = await query('SELECT 1 FROM `canvas_done` WHERE `card_id` = ? AND `user_id` = ? LIMIT 1', [card, user]);
        if (res.length == 0) return { result: false };
        else return { result: true };
    } catch (error) {
        writeLog(error.stack);
        return { error }
    }
};

const load = async(cardId) => {  
    try {
        const objects = await query("SELECT `object` FROM `canvas_done` WHERE `card_id` = ? AND `id` IN (SELECT MAX(`id`) FROM `canvas_done` GROUP BY `obj_id`) AND (`action` = 'create' OR `action` = 'modify')", cardId);
        let result = [];
        objects.map(item => result.push(item.object));
        return { result: result };
    } catch (error) {
        writeLog(error.stack);
        return { error }
    }
};

const undo = async(card, user) => {
    const time = Date.now();
    try {
        await transaction();
        let lastStep = await query('SELECT * FROM `canvas_done` WHERE `card_id` = ? AND `user_id` = ? ORDER BY `id` DESC LIMIT 1', [card, user]);
        if (lastStep[0].action == 'origin') {
            await commit();
            return { error: { customError: 'Already The Last Step' } };
        }
        if (lastStep[0].action == 'recreate') {
            const data = {
                card_id: lastStep[0].card_id,
                user_id: lastStep[0].user_id,
                action: lastStep[0].action,
                obj_id: lastStep[0].obj_id,
                obj_type: lastStep[0].obj_type,
                object: lastStep[0].object,
                is_background: lastStep[0].is_background
            };
            await query('INSERT INTO `canvas_undo` SET ?', data);
            await query('DELETE FROM `canvas_done` WHERE `id` = ?', lastStep[0].id);
            await commit();
            return undo(card, user);
        }
        // 如果同步加上順序的資訊，在這要做一次query，取得順序，然後塞進result
        let result;
        if (lastStep[0].is_background == true) {
            // 如果上一步是background，還要query出再上一個user background
            const lastUserBackground = await query('SELECT * FROM `canvas_done` WHERE `card_id` = ? AND `user_id` = ? AND `is_background` = ? ORDER BY `id` DESC LIMIT 2', [card, user, true]);
            if (lastUserBackground.length == 1) {
                result = [
                    {action: 'remove', object: lastStep[0].obj_id}
                ];
            } 
            else {              
                result = [
                    {action: 'create', object: [lastUserBackground[1].object]}
                ];
            }
        } else if (lastStep[0].action == 'create') {
            result = [
                {action: 'remove', object: lastStep[0].obj_id}
            ];
        } else if (lastStep[0].action == 'remove') {
            result = [
                {action: 'create', object: [lastStep[0].object]}
            ];
        } else {
            const objLastStep = await query('SELECT * FROM `canvas_done` WHERE `card_id` = ? AND `user_id` = ? AND `obj_id` = ? ORDER BY `id` DESC LIMIT 2', [card, user, lastStep[0].obj_id]);
            result = [
                {action: 'remove', object: lastStep[0].obj_id},
                {action: 'create', object: [objLastStep[1].object]}
            ];
        }
        const data = {
            card_id: lastStep[0].card_id,
            user_id: lastStep[0].user_id,
            action: lastStep[0].action,
            obj_id: lastStep[0].obj_id,
            obj_type: lastStep[0].obj_type,
            object: lastStep[0].object,
            is_background: lastStep[0].is_background
        };
        await query('INSERT INTO `canvas_undo` SET ?', data);
        await query('DELETE FROM `canvas_done` WHERE `id` = ?', lastStep[0].id);
        await query('SELECT `saved_at` FROM `card` WHERE `id` = ? FOR UPDATE', card);
        await query('UPDATE `card` SET `saved_at` = ? WHERE `id` = ?', [time, card]);
        await commit();
        return { result: result };
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
        const formerStep = (await query('SELECT * FROM `canvas_undo` WHERE `card_id` = ? AND `user_id` = ? ORDER BY `id` DESC LIMIT 2', [card, user]))[0];
        if (!formerStep) {
            await commit();
            return { error: { customError: 'Already The Last Step' } };
        }
        let result;
        if (formerStep.action == 'create') {
            result = [
                {action: 'create', object: [formerStep.object]}
            ];
        } else if (formerStep.action == 'remove') {
            result = [
                {action: 'remove', object: formerStep.obj_id}
            ];
        } else if (formerStep.action == 'modify') {
            result = [
                {action: 'remove', object: formerStep.obj_id},
                {action: 'create', object: [formerStep.object]}
            ];
        } else if (formerStep.action == 'recreate') {
            const data = {
                card_id: formerStep.card_id,
                user_id: formerStep.user_id,
                action: formerStep.action,
                obj_id: formerStep.obj_id,
                obj_type: formerStep.obj_type,
                object: formerStep.object,
                is_background: formerStep.is_background
            };
            await query('INSERT INTO `canvas_done` SET ?', data);
            await query('DELETE FROM `canvas_undo` WHERE `id` = ?', formerStep.id);
            await commit();
            return redo(card, user);
        }
        const data = {
            card_id: formerStep.card_id,
            user_id: formerStep.user_id,
            action: formerStep.action,
            obj_id: formerStep.obj_id,
            obj_type: formerStep.obj_type,
            object: formerStep.object,
            is_background: formerStep.is_background
        };
        await query('INSERT INTO `canvas_done` SET ?', data);
        await query('DELETE FROM `canvas_undo` WHERE `id` = ?', formerStep.id);
        await query('SELECT `saved_at` FROM `card` WHERE `id` = ? FOR UPDATE', card);
        await query('UPDATE `card` SET `saved_at` = ? WHERE `id` = ?', [time, card]);
        await commit();
        return { result: result };
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