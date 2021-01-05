const {assert, requester} = require('./set_up'); // use requester for api testing
const {query} = require('../server/models/mysqlcon');
const Util = require('../util/util');

describe('addTest', () => {
    it('1+1 should be 2', () => {
        assert.equal(Util.addTest(1,1), 2);
        assert.equal(Util.addTest(1, -1), 0);
    });
});
