const { socketJoin } = require("../controllers/card_controller");

const socketCon = (io) => {
    io.on('connection', socketJoin)
};

// const errorHandling = (io, data) => {
//     io.use(function (socket, next) {
//         const err = new Error();
//         err.data = data;
//         next(err);
//     });
// };

module.exports = {
    socketCon
};