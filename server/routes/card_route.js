const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const {
    saveCanvas,
    loadCanvas
} = require('../controllers/card_controller');
  
router.route('/canvas/savecanvas')
    .post(wrapAsync(saveCanvas));

router.route('/canvas/loadcanvas')
    .get(wrapAsync(loadCanvas));

module.exports = router;

