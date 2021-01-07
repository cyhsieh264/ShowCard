const {assert, requester} = require('./set_up'); // use requester for api testing
const AssetModel = require('../server/models/asset_model');

describe('get assets', () => {
    it('get backgrounds', async () => {
        assert.isArray((await AssetModel.getAssets('background')).result, 'value of the result is an array');
        assert.lengthOf((await AssetModel.getAssets('background')).result, 3, 'array has length of 3');
    });
    it('get icons', async () => {
        assert.isArray((await AssetModel.getAssets('icon')).result, 'value of the result is an array');
        assert.lengthOf((await AssetModel.getAssets('icon')).result, 2, 'array has length of 2');
    });
});
