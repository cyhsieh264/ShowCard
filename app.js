require('dotenv').config();
const { NODE_ENV, PORT, PORT_TEST, PORT_PEER_SERVER, API_VERSION } = process.env;
const port = NODE_ENV === 'test' ? PORT_TEST : PORT;
const { writeLog } = require('./util/util');

const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CORS
app.use((req, res, next) => {
    const allowedOrigins = ['https://showcard.online', 'https://showcard.online'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
    next();
});

// Json Setting
app.set('json spaces', 2);

// Socket.io
// const server = require('http').Server(app);
// const io = require('socket.io')(server);
// const { socketCon } = require('./util/socketcon');
// socketCon(io);

// // Peerjs
// const { PeerServer } = require('peer');
// const peerServer = PeerServer({ port: PORT_PEER_SERVER, path: '/call' });

// API routes
app.use('/api/' + API_VERSION,
    [
        // require('./server/routes/studio_route'),
        require('./server/routes/card_route')
    ]
);

// Page not found
app.use(function (req, res, next) {
    res.status(404).redirect('/404.html');
});

// Error handling
app.use(function (err, req, res, next) {
    const { status, error } = err;
    writeLog({ error });
    if (status && error) {
        res.status(status).json({ error });
    } else {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

if (NODE_ENV != 'production'){
    app.listen(port, () => {console.log(`The application is running at http://localhost:${port}`);});
}

// server.listen(port, () => {
//     console.log(`App is now running on port: ${port}`);
// });

// module.exports = server;