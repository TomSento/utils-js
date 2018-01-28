const U = require('../dist/utils.git');

U.test('errorBuilder.getData()', function(assert) {
    var done = assert.async();
    assert.expect(2);
    setTimeout(function() {
        assert.ok();
        assert.fail();
        done();
    });
    setTimeout(function() {
        assert.ok();
        assert.fail();
        done();
    });
});
U.test('errorBuilder.getData().setName()', function(assert) {
    assert.ok(true, 'It should set name.');
});
