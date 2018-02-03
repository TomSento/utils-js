var U = require('../dist/utils.git');

U.test('errorBuilder.getData()', function(assert) {
    var done = assert.async(2);
    // assert.expect(2); // JUST FOR TIMEOUT - V2
    setTimeout(function() {
        assert.ok(1);
        assert.fail(2);
        done();
    }, 2000);
    setTimeout(function() {
        assert.ok(3);
        assert.fail(4);
        done();
    }, 4000);
});
U.test('errorBuilder.getData().setName()', function(assert) {
    assert.ok(5);
    // throw new Error('terminateTesting');
});
U.test('errorBuilder.getData().getAge()', function(assert) {
    assert.ok(6);
});
