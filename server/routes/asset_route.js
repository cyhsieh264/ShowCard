const router = require('express').Router();
const { wrapAsync } = require('../../util/util');

const {
    getAssets
} = require('../controllers/asset_controller');

router.route('/asset/:category')
    .get(wrapAsync(getAssets));

module.exports = router;