const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const {
    signup,
    signin,
    verify
} = require('../controllers/user_controller');

router.route('/user/signup')
    .post(wrapAsync(signup));

router.route('/user/signin')
    .post(wrapAsync(signin));

router.route('/user/verify')
    .get(wrapAsync(verify));

module.exports = router;