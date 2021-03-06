require('dotenv').config();
const { NODE_ENV, PORT, PORT_TEST, API_VERSION } = process.env;
const port = NODE_ENV === 'test' ? PORT_TEST : PORT;
const { writeLog } = require('./util/util');

const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb'} ));

// Json Setting
app.set('json spaces', 2);

// Socket.io
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { socketCon } = require('./server/sockets/socketcon');
socketCon(io);

// API routes
app.use('/api/' + API_VERSION,
    [
        require('./server/routes/user_route'),
        require('./server/routes/studio_route'),
        require('./server/routes/card_route'),
        require('./server/routes/canvas_route'),
        require('./server/routes/asset_route')
    ]
);

// Page not found
app.use(function (req, res, next) {
    res.status(404).redirect('/404.html');
});

// Error handling
app.use(function (err, req, res, next) {
    const { stack } = err;
    writeLog(stack);
    res.status(500).json({ error: 'Internal server error' });
});

http.listen(port, () => {
    console.log(`The application is running on port ${port}`);
});

module.exports = app;