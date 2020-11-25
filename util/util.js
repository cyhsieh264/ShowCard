require('dotenv').config();
const fs = require('fs');
const path = require('path');

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
    fs.appendFile(path.join(__dirname, '../log.txt'), record + '\n', function (err) { });
};

module.exports = {
    wrapAsync,
    writeLog
};