const { query, transaction, commit, rollback } = require('./mysqlcon');

const save = async(data) => {
    try {
        await transaction();
        await query('INSERT INTO `canvas_done` SET ?', data);
        await commit();
        return true;
    } catch (error) {
        await rollback();
        return { error };
    }
}

const undo = async() => {
    try {
        await transaction();
        const lastProcess = (await query('SELECT * FROM `canvas_done` WHERE `user_display_name` = ? ORDER BY `id` DESC LIMIT 1', 'guest1'))[0];
        const data = {
            card_id: lastProcess.card_id,
            user_id: lastProcess.user_id,
            user_display_name: lastProcess.user_display_name,
            action: lastProcess.action,
            canvas: lastProcess.canvas
        }
        await query('INSERT INTO `canvas_undo` SET ?', data);
        await query('DELETE FROM `canvas_done` WHERE `id` = ?', lastProcess.id);
        const process = await query('SELECT * FROM `canvas_done` WHERE `user_display_name` = ? ORDER BY `id` DESC LIMIT 1', 'guest1');
        await commit();
        return process;
    } catch (error) {
        await rollback();
        return { error };
    }
}

const redo = async() => {
    try {
        await transaction();
        const formerProcess = (await query('SELECT * FROM `canvas_undo` WHERE `user_display_name` = ? ORDER BY `id` DESC LIMIT 1', 'guest1'))[0];
        const data = {
            card_id: formerProcess.card_id,
            user_id: formerProcess.user_id,
            user_display_name: formerProcess.user_display_name,
            action: formerProcess.action,
            canvas: formerProcess.canvas
        }
        await query('INSERT INTO `canvas_done` SET ?', data);
        await query('DELETE FROM `canvas_undo` WHERE `id` = ?', formerProcess.id);
        const process = await query('SELECT * FROM `canvas_done` WHERE `user_display_name` = ? ORDER BY `id` DESC LIMIT 1', 'guest1');
        await commit();
        return process;
    } catch (error) {
        await rollback();
        return { error };
    }
}

module.exports = {
    save,
    undo,
    redo
}