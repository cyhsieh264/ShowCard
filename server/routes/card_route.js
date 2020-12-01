const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const {
    saveInitCanvas,
    saveCanvas,
    checkCanvas,
    loadCanvas,
    undoCanvas,
    redoCanvas
} = require('../controllers/canvas_controller');
  
router.route('/canvas/saveinitcanvas')
    .post(wrapAsync(saveInitCanvas));

router.route('/canvas/savecanvas')
    .post(wrapAsync(saveCanvas));

router.route('/canvas/checkcanvas')
    .get(wrapAsync(checkCanvas));

router.route('/canvas/loadcanvas')
    .get(wrapAsync(loadCanvas));

router.route('/canvas/undocanvas')
    .get(wrapAsync(undoCanvas));

router.route('/canvas/redocanvas')
    .get(wrapAsync(redoCanvas));

module.exports = router;