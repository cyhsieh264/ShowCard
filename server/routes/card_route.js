const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const {
    test,
} = require('../controllers/card_controller');
  
router.route('/card/test')
    .get(wrapAsync(test));
  
module.exports = router;

