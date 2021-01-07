require('dotenv').config();
const {NODE_ENV} = process.env;
const bcrypt = require('bcrypt');
const { assets } = require('./fake_data');
const { query, end } = require('../server/models/mysqlcon');
const salt = parseInt(process.env.BCRYPT_SALT);

async function _createFakeAsset () {
    return await query('INSERT INTO `asset` (title, file_format, category, width, height, left_position, top_position) VALUES ?', [assets.map(asset => Object.values(asset))]);
}

async function createFakeData() {
    if (NODE_ENV !== 'test') {
        console.log('Not in test env');
        return;
    }
    return await _createFakeAsset()
        .catch(console.log);
}

async function truncateFakeData() {
    if (NODE_ENV !== 'test') {
        console.log('Not in test env');
        return;
    }
    const setForeignKey = (status) => {
        return query('SET FOREIGN_KEY_CHECKS = ?', status);
    };
    const truncateTable = (table) => {
        return query(`TRUNCATE TABLE ${table}`);
    };
    return setForeignKey(0)
        .then(truncateTable('asset'))
        .then(setForeignKey(1))
        .catch(console.log);
}

function closeConnection() {
    return end();
}

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