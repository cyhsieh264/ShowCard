const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const {
    createCard,
} = require('../controllers/card_controller');
  
router.route('/card/create')
    .post(wrapAsync(createCard));

module.exports = router;