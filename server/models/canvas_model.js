const { query, transaction, commit, rollback } = require('./mysqlcon');
const { writeLog } = require('../../util/util');

const save = async(data) => {
    try {
        const time = Date.now();
        if (data.action == 'modify') {
            const existence = await query('SELECT 1 FROM `canvas_done` WHERE `card_id` = ? AND `user_id` = ? AND `obj_id` = ? LIMIT 1', [data.card_id, data.user_id, data.obj_id]);
            if (existence.length == 0) {
                const lastStatus = (await query('SELECT * FROM `canvas_done` WHERE `card_id` = ? AND `obj_id` = ? ORDER BY `id` DESC LIMIT 1', [data.card_id, data.obj_id]))[0];
                console.log(lastStatus);
                const status = {
                    card_id: data.card_id,
                    user_id: data.user_id,
                    action: 'recreate',
                    obj_id: lastStatus.obj_id,
                    obj_type: lastStatus.obj_type,
                    object: lastStatus.object
                };
                await transaction();
                await query('INSERT INTO `canvas_done` SET ?', status);
                await commit();
            }
        }
        await transaction();
        await query('INSERT INTO `canvas_done` SET ?', data);
        await query('DELETE FROM `canvas_undo` WHERE `card_id` = ? AND `obj_id` = ?', [data.card_id, data.obj_id]);
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
        const lastStep = await query('SELECT * FROM `canvas_done` WHERE `card_id` = ? AND `user_id` = ? ORDER BY `id` DESC LIMIT 2', [card, user]);
        if (lastStep[0].action == 'origin' || lastStep[0].action == 'recreate') {
            await commit();
            return { error: { customError: 'Already the last step' } };
        }
        let result;
        switch (lastStep[0].action) {
            case 'create':
                result = [
                    {
                        action: 'remove',
                        object: lastStep[0].obj_id
                    }
                ]
                break;
            case 'remove':
                result = [
                    {
                        action: 'create',
                        object: [lastStep[1].object]
                    }
                ]
                break;
            case 'modify':
                // const lastStatus = await query('SELECT * FROM `canvas_done` WHERE `card_id` = ? AND `obj_id` = ? ORDER BY `id` DESC LIMIT 2', [card, lastStep[0].obj_id]);
                // const last2Action = lastStep[1].action;
                // if (last2Action == 'create') {

                // }
                result = [
                    {
                        action: 'remove',
                        object: lastStep[0].obj_id
                    },
                    {
                        action: 'create',
                        object: [lastStep[1].object]
                    }
                ]
                break;
        }
        const data = {
            card_id: lastStep[0].card_id,
            user_id: lastStep[0].user_id,
            action: lastStep[0].action,
            obj_id: lastStep[0].obj_id,
            obj_type: lastStep[0].obj_type,
            object: lastStep[0].object
        };
        await query('INSERT INTO `canvas_undo` SET ?', data);
        await query('DELETE FROM `canvas_done` WHERE `id` = ?', lastStep[0].id);
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
        const formerStep = (await query('SELECT * FROM `canvas_undo` WHERE `card_id` = ? AND `user_id` = ? ORDER BY `id` DESC LIMIT 1', [card, user]))[0];
        if (!formerStep) {
            await commit();
            return { error: { customError: 'Already the last step' } };
        }
        let result;
        switch (formerStep.action) {
            case 'create':
                result = [
                    {
                        action: 'create',
                        object: [formerStep.object]
                    }
                ]
                break;
            case 'remove':
                result = [
                    {
                        action: 'remove',
                        object: formerStep.obj_id
                    }
                ]
                break;
            case 'modify':
                // const formerStatus = (await query('SELECT * FROM `canvas_undo` WHERE `card_id` = ? AND `user_id` = ? ORDER BY `id` DESC LIMIT 1', [card, user]))[0];
                result = [
                    {
                        action: 'remove',
                        object: formerStep.obj_id
                    },
                    {
                        action: 'create',
                        object: [formerStep.object]
                    }
                ]
                break;
        }
        const data = {
            card_id: formerStep.card_id,
            user_id: formerStep.user_id,
            action: formerStep.action,
            obj_id: formerStep.obj_id,
            obj_type: formerStep.obj_type,
            object: formerStep.object
        };
        await query('INSERT INTO `canvas_done` SET ?', data);
        await query('DELETE FROM `canvas_undo` WHERE `id` = ?', formerStep.id);
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