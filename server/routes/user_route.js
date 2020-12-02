const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const {
    checkExistence,
} = require('../controllers/user_controller');
  
router.route('/user/checkexistence')
    .get(wrapAsync(checkExistence));

module.exports = router;