require('dotenv').config();
const bcrypt = require('bcrypt');
const salt = parseInt(process.env.BCRYPT_SALT);
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const User = require('../models/user_model');
const { verifyToken } = require('../../util/util');

const signup = async (req, res) => {
    if ( !req.body.email || !req.body.name || !req.body.password ) {
        return res.status(400).json({ error: 'Sign up information is incomplete' });
    }
    const data = {
        provider: req.body.provider,
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
    const userToken = jwt.sign({
        id: result.insertId,
        email: req.body.email,
        name: req.body.name
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 86400 });
    return res.status(200).json({ data: { user_token: userToken } });
};

const nativeSignin = async (email, password) => {
    if ( !email || !password ) {
        return {error: 'Sign in information is incomplete', status: 400};
    }
    const { result, error } = await User.nativeSignin(email);
    if (error) {
        if (error.customError) return { error: error.customError, status: 403};
        return { error: 'Sign in failed', status: 500 };
    }
    if (!bcrypt.compareSync(password, result.password)) {
        return { error: 'Incorrect email or password', status: 403};
    }
    return result;
};

const fetchGoogleInfo = (googleToken) => {
    return new Promise((resolve, reject) => {
        let url = `https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`;
        fetch(url)
            .then(fetchResult => {
                return fetchResult.json();
            })
            .then(jsonInfo => {
                let googleInfo = {
                    name: jsonInfo.name,
                    email: jsonInfo.email
                };
                resolve(googleInfo);
            });
    });
};

const googleSignin = async (token) => {
    const googleInfo = await fetchGoogleInfo(token);
    if (!googleInfo.email) return { error: 'Sign in failed', status: 500 };
    const { result, error } = await User.googleSignin(googleInfo);
    if (error) return { error: 'Sign in failed', status: 500 };
    return result;
};

const signin = async (req, res) => {
    const data = req.body;
    let result;
    switch (data.provider) {
        case 'native':
            result = await nativeSignin(data.email, data.password);
            break;
        case 'google':
            result = await googleSignin(data.token);
            break;
        default:
            result = { error: 'Wrong Request' };
    }
    if (result.error) {
        const statusCode = result.status ? result.status : 403;
        return res.status(statusCode).json({ error: result.error });
    }
    const userToken = jwt.sign({
        id: result.id,
        email: result.email,
        name: result.name
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 86400 });
    return res.status(200).json({ data: { user_token: userToken } });
};

const verify = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
    try {
        const payload = await verifyToken(token);
        return res.status(200).json({ data: { payload } })
    } catch {
        res.status(200).json( { message: 'Invalid user token' } );
    }
};

module.exports = {
    signup,
    signin,
    verify
};