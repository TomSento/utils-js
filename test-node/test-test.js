var U = require('../dist/utils.git');

U.test('errorBuilder.getData()', function(assert) {
    var done = assert.async(2);
    assert.expect(4);
    // throw new Error('aaaa');
    setTimeout(function() {
        // assert.ok(true, 'ASSERT0');
        // assert.notOk(true, 'ASSERT1');
        done();
    }, 15000);
    setTimeout(function() {
        assert.ok(true, 'ASSERT2');
        // assert.notOk(true, 'ASSERT3');
        done();
    }, 17000);
}, 17000);
U.test('errorBuilder.getData().setName()', function(assert) {
    assert.expect(1);
    assert.ok(true, 'ASSERT4');
    // throw new Error('terminateTesting');
});
U.test('errorBuilder.getData().getAge()', function(assert) {
    assert.ok(true, 'ASSERT5');
});
