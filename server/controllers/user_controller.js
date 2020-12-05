require('dotenv').config();
const bcrypt = require('bcrypt');
const salt = parseInt(process.env.BCRYPT_SALT);
const jwt = require('jsonwebtoken');
const User = require('../models/user_model');
const { writeLog, verifyToken } = require('../../util/util');

const signup = async (req, res) => {
    if ( !req.body.email || !req.body.name || !req.body.password ) {
        return res.status(400).json({ error: 'Sign up information is incomplete' });
    }
    const data = {
        provider: 'native',
        email: req.body.email,
        name: req.body.name,
        password: bcrypt.hashSync(req.body.password, salt),
        created_at: Date.now(),
        active: true
    };
    const { result, error } = await User.signup(data);
    if (error) {
        if (error.customError) return res.status(403).json({ error: error.customError });
        return res.status(500).json({ error: 'Sign up failed' });
    }
    const accessToken = jwt.sign({
        email: req.body.email,
        name: req.body.name,
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
    return res.status(200).json({ data: { user_token: accessToken } });
};

const signin = async (req, res) => {
    if ( !req.body.email || !req.body.password ) {
        return res.status(400).json({ error: 'Sign up information is incomplete' });
    }
    const { result, error } = await User.signin(req.body.email);
    if (error) {
        if (error.customError) return res.status(403).json({ error: error.customError });
        return res.status(500).json({ error: 'Sign in failed' });
    }
    if (!bcrypt.compareSync(req.body.password, result.password)) {
        return res.status(403).json({ error: 'Incorrect email or password' });
    }
    const userToken = jwt.sign({
        name: result.name,
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });
    return res.status(200).json({ data: { user_token: userToken } });
};

const verify = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
    try {
        const payload = await verifyToken(token);
        return res.status(200).json({ data: { name: payload.name } })
    } catch {
        res.status(403).json( { error: 'Invalid user token' } );
    }
};

module.exports = {
    signup,
    signin,
    verify
};