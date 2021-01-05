require('dotenv').config();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

// reference: https://thecodebarbarian.com/80-20-guide-to-express-error-handling
const wrapAsync = (fn) => {
    return function(req, res, next) {
        // Make sure to `.catch()` any errors and pass them along to the `next()`
        // middleware in the chain, in this case the error handler.
        fn(req, res, next).catch(next);
    };
};

const writeLog = (content) => {
    const timeTaipei = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei', hour12: false });
    let record = `Timestamp: ${Date.now()} Time: ${timeTaipei}\n${JSON.stringify(content)}\n`;
    fs.appendFile(path.join(__dirname, '../error.log'), record + '\n', function (err) { });
};

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) reject(false);
            else resolve(payload);
        });
    });
};

module.exports = {
    wrapAsync,
    writeLog,
    verifyToken
};