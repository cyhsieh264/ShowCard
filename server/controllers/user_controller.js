require('dotenv').config();
const bcrypt = require('bcrypt');
const salt = parseInt(process.env.BCRYPT_SALT);
const User = require('../models/user_model');
const { writeLog } = require('../../util/util');

const signup = async (req, res) => {
    const data = {
        provider: 'native',
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, salt),
        created_at: Date.now(),
        active: true
    };
    const { message, error } = await User.signup(data);
    if (error) {
        const { stack } = error;
        writeLog({ stack });
        return res.status(500).json({ error: 'Database Query Error' });
    }
    // generate token

    // return res.status(200).json({ access_token: '12345' });
};

const checkExistence = () => {
    
};

module.exports = {
    signup,
    checkExistence,
};