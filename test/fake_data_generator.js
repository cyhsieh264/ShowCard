require('dotenv').config();
const {NODE_ENV} = process.env;
const { assets, objects } = require('./fake_data');
const { query, transaction, commit, end } = require('../server/models/mysqlcon');

const _createFakeAsset = async () => {
    await transaction();
    await query('INSERT INTO `asset` (title, file_format, category, width, height, left_position, top_position) VALUES ?', [assets.map(asset => Object.values(asset))]);
    await commit();
    return;
};

const _createFakeCanvas = async () => {
    await transaction();
    await query('SET FOREIGN_KEY_CHECKS = ?', false);
    await query('INSERT INTO `canvas_done` (card_id, user_id, action, obj_id, obj_type, object, is_background) VALUES ?', [objects.map(object => Object.values(object))]);
    await query('SET FOREIGN_KEY_CHECKS = ?', true);
    await commit();
    return;
};

const createFakeData = () => {
    if (NODE_ENV !== 'test') {
        console.log('Not in test env');
        return;
    }
    return _createFakeAsset()
        .then(_createFakeCanvas)
        .catch(console.log);
};

const truncateFakeData = () => {
    if (NODE_ENV !== 'test') {
        console.log('Not in test env');
        return;
    }
    const truncateTable = async (table) => {
        await transaction();
        await query('SET FOREIGN_KEY_CHECKS = ?', false);
        await query(`TRUNCATE TABLE ${table}`);
        await query('SET FOREIGN_KEY_CHECKS = ?', true);
        await commit();
        return;
    };
    return truncateTable('asset')
        .then(truncateTable('canvas_done'))
        .catch(console.log);
};

const closeConnection = () => {
    return end();
};

// execute when called directly.
if (require.main === module) {
    console.log('main');
    truncateFakeData()
        .then(createFakeData)
        .then(closeConnection);
}

module.exports = {
    createFakeData,
    truncateFakeData,
    closeConnection
};