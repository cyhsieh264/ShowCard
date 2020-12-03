require('dotenv').config();
const bcrypt = require('bcrypt');
const salt = parseInt(process.env.BCRYPT_SALT);
const jwt = require('jsonwebtoken');
const User = require('../models/user_model');
const { writeLog, verifyToken } = require('../../util/util');

const signup = async (req, res) => {
    // if ( !req.body.email || !password){
    //     return {error: 'Request Error: email and password are required.', status: 400};
    // }






    const data = {
        provider: 'native',
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, salt),
        created_at: Date.now(),
        active: true
    };
    const { message, error } = await User.signup(data);
    if (message != 'Success') return res.status(403).json({ message: message });
    if (error) {
        const { stack } = error;
        writeLog({ stack });
        return res.status(500).json({ error: 'Database query error' });
    }
    const accessToken = jwt.sign({
        username: req.body.username,
        email: req.body.email 
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 20 });
    return res.status(200).json({ access_token: accessToken });
};

const signin = async (req, res) => {
    const data = {
        user: req.body.user,
        password: req.body.password
    };
    const { result, message, error } = await User.signin(data);
    if (message) return res.status(403).json({ message: message });
    if (error) {
        const { stack } = error;
        writeLog({ stack });
        return res.status(500).json({ error: 'Database query error' });
    }
    const accessToken = jwt.sign({
        username: result.username,
        email: result.email 
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 20 });
    return res.status(200).json({ access_token: accessToken });
    


}

const checkExistence = () => {
    
};

module.exports = {
    signup,
    signin,
    checkExistence
};