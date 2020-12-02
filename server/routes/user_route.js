const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const {
    signup,
    checkExistence,
} = require('../controllers/user_controller');

router.route('/user/signup')
    .post(wrapAsync(signup));

router.route('/user/checkexistence')
    .get(wrapAsync(checkExistence));

module.exports = router;