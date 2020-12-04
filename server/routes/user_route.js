const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const {
    signup,
    signin,
    verify,
    checkExistence
} = require('../controllers/user_controller');

router.route('/user/signup')
    .post(wrapAsync(signup));

router.route('/user/signin')
    .post(wrapAsync(signin));

router.route('/user/verify')
    .post(wrapAsync(verify));

router.route('/user/checkexistence')
    .post(wrapAsync(checkExistence));

module.exports = router;