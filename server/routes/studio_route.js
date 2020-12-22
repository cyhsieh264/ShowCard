const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const {
    getUserCards
} = require('../controllers/studio_controller');
  
router.route('/studio/user')
    .get(wrapAsync(getUserCards));
  
module.exports = router;