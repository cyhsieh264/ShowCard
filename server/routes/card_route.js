const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const {
    checkCard,
    enrollCard,
    createCard,
    renameCard,
    getTitle
} = require('../controllers/card_controller');

router.route('/card/check')
    .get(wrapAsync(checkCard));

router.route('/card/title')
    .get(wrapAsync(getTitle));

router.route('/card/enroll')
    .get(wrapAsync(enrollCard));

router.route('/card/create')
    .post(wrapAsync(createCard));

router.route('/card/rename')
    .patch(wrapAsync(renameCard));

module.exports = router;