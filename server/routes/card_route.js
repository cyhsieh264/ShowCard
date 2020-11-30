const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const {
    saveCanvas,
    undoCanvas,
    redoCanvas
} = require('../controllers/canvas_controller');
  
router.route('/canvas/savecanvas')
    .post(wrapAsync(saveCanvas));

router.route('/canvas/undocanvas')
    .get(wrapAsync(undoCanvas));

router.route('/canvas/redocanvas')
    .get(wrapAsync(redoCanvas));

module.exports = router;