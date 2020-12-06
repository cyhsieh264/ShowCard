const { joinRoom } = require("../controllers/card_controller");

const socketCon = (io) => {
    io.on('connection', joinRoom)
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