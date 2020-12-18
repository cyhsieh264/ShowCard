const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const {
    saveCanvas,
    uploadScreenshot,
    checkCanvas,
    loadCanvas,
    undoCanvas,
    redoCanvas
} = require('../controllers/canvas_controller');

router.route('/canvas/save')
    .post(wrapAsync(saveCanvas));

router.route('/canvas/screenshot')
    .post(wrapAsync(uploadScreenshot));

router.route('/canvas/check')
    .get(wrapAsync(checkCanvas));

router.route('/canvas/load')
    .get(wrapAsync(loadCanvas));

router.route('/canvas/undo')
    .get(wrapAsync(undoCanvas));

router.route('/canvas/redo')
    .get(wrapAsync(redoCanvas));

module.exports = router;