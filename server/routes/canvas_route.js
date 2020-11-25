const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const {
    test,
} = require('../controllers/canvas_controller');
  
router.route('/canvas/test')
    .get(wrapAsync(test));
  
module.exports = router;

