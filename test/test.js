const {assert, requester} = require('./set_up');
const Asset = require('../server/models/asset_model');

describe('get assets', () => {
    it('get backgrounds', async () => {
        assert.isArray((await Asset.getAssets('background')).result, 'value of the result is an array');
        assert.lengthOf((await Asset.getAssets('background')).result, 3, 'array has length of 3');
    });
    it('get icons', async () => {
        assert.isArray((await Asset.getAssets('icon')).result, 'value of the result is an array');
        assert.lengthOf((await Asset.getAssets('icon')).result, 2, 'array has length of 2');
    });
});

describe('check canvas status', () => {
    it('check canvas with correct card ID and correct user ID', async () => {
        const res = await requester
            .get('/api/1.0/canvas/check')
            .query({card: '7h2c9vp2esgnh3d', user: 1});
        const data = res.body.data;
        assert.equal(data.existence, true);
    });
    it('check canvas with correct card ID but wrong user ID', async () => {
        const res = await requester
            .get('/api/1.0/canvas/check')
            .query({card: '7h2c9vp2esgnh3d', user: 18});
        const data = res.body.data;
        assert.equal(data.existence, false);
    });
    it('check canvas with correct user ID but wrong card ID', async () => {
        const res = await requester
            .get('/api/1.0/canvas/check')
            .query({card: 'aw3rlrjalkdg7fk', user: 2});
        const data = res.body.data;
        assert.equal(data.existence, false);
    });
    it('check canvas with wrong card ID and wrong user ID', async () => {
        const res = await requester
            .get('/api/1.0/canvas/check')
            .query({card: 'aw3rlrjalkdg7fk', user: 18});
        const data = res.body.data;
        assert.equal(data.existence, false);
    });
});