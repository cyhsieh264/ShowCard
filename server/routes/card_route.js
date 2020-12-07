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

// router.route('/card/user') 用socket做？
//     .get(wrapAsync(countUser));

router.route('/card/member/add')
    .patch(wrapAsync(addMember));

// router.route('/card/member/reduce') 用socket做？
//     .patch(wrapAsync(reduceMember));

module.exports = router;