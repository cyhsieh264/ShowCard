const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const {
    checkCard,
    createCard,
    addMember
} = require('../controllers/card_controller');
  
router.route('/card/check')
    .get(wrapAsync(checkCard));

router.route('/card/create')
    .post(wrapAsync(createCard));

router.route('/card/addmember')
    .patch(wrapAsync(addMember));

module.exports = router;