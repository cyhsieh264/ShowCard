require('dotenv').config();
const bcrypt = require('bcrypt');
const salt = parseInt(process.env.BCRYPT_SALT);
const jwt = require('jsonwebtoken');
const User = require('../models/user_model');
const { writeLog, verifyToken } = require('../../util/util');

const signup = async (req, res) => {
    if ( !req.body.username || !req.body.email || !req.body.password ) {
        return res.status(400).json({ error: 'Sign up information is incomplete' });
    }
    const data = {
        provider: 'native',
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, salt),
        created_at: Date.now(),
        active: true
    };
    const { result, error } = await User.signup(data);
    if (error) {
        if (error.customError) return res.status(403).json({ error: error.customError });
        return res.status(500).json({ error: 'Internal server error' });
    }
    const accessToken = jwt.sign({
        username: req.body.username,
        email: req.body.email 
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
    return res.status(200).json({ data: { access_token: accessToken } });
};

const signin = async (req, res) => {
    if ( !req.body.user || !req.body.password ) {
        return res.status(400).json({ error: 'Sign up information is incomplete' });
    }
    const { result, error } = await User.signin(req.body.user);
    if (error) {
        if (error.customError) return res.status(403).json({ error: error.customError });
        return res.status(500).json({ error: 'Internal server error' });
    }
    if (!bcrypt.compareSync(req.body.password, result.password)) {
        return res.status(403).json({ error: 'Password is wrong' });
    }
    const accessToken = jwt.sign({
        username: result.username,
        email: result.email 
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
    return res.status(200).json({ data: { access_token: accessToken } });
}

const checkExistence = (category, value) => {
    
};

module.exports = {
    signup,
    signin,
    checkExistence
};