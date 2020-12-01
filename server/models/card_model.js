const { query, transaction, commit, rollback } = require('./mysqlcon');

const save = async(data) => {
    try {
        await transaction();
        await query('INSERT INTO `canvas_done` SET ?', data);
        await query('DELETE FROM `canvas_undo` WHERE `user_display_name` = ?', data.user_display_name);
        await commit();
        return true;
    } catch (error) {
        await rollback();
        return { error };
    }
}

const check = async() => {
    return await query('SELECT COUNT(`user_display_name`) FROM `canvas_done` WHERE `user_display_name` = ?', 'guest1');
}

const load = async() => {
    return (await query('SELECT * FROM `canvas_done` WHERE `user_display_name` = ? ORDER BY `id` DESC LIMIT 1', 'guest1'))[0];
}

const undo = async() => {
    try {
        await transaction();
        const lastStep = (await query('SELECT * FROM `canvas_done` WHERE `user_display_name` = ? ORDER BY `id` DESC LIMIT 1', 'guest1'))[0];
        if (lastStep.init == true) return false
        const data = {
            card_id: lastStep.card_id,
            user_id: lastStep.user_id,
            user_display_name: lastStep.user_display_name,
            action: lastStep.action,
            canvas: lastStep.canvas,
            init: lastStep.init
        }
        await query('INSERT INTO `canvas_undo` SET ?', data);
        await query('DELETE FROM `canvas_done` WHERE `id` = ?', lastStep.id);
        const process = await query('SELECT * FROM `canvas_done` WHERE `user_display_name` = ? ORDER BY `id` DESC LIMIT 1', 'guest1');
        await commit();
        return process[0];
    } catch (error) {
        await rollback();
        return { error };
    }
}

const redo = async() => {
    try {
        await transaction();
        const formerStep = (await query('SELECT * FROM `canvas_undo` WHERE `user_display_name` = ? ORDER BY `id` DESC LIMIT 1', 'guest1'))[0];
        if (!formerStep) return false
        const data = {
            card_id: formerStep.card_id,
            user_id: formerStep.user_id,
            user_display_name: formerStep.user_display_name,
            action: formerStep.action,
            canvas: formerStep.canvas,
            init: formerStep.init
        }
        await query('INSERT INTO `canvas_done` SET ?', data);
        await query('DELETE FROM `canvas_undo` WHERE `id` = ?', formerStep.id);
        const step = await query('SELECT * FROM `canvas_done` WHERE `user_display_name` = ? ORDER BY `id` DESC LIMIT 1', 'guest1');
        await commit();
        return step[0];
    } catch (error) {
        await rollback();
        return { error };
    }
}

module.exports = {
    save,
    check,
    load,
    undo,
    redo
}