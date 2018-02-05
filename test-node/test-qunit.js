var QUnit = require('qunit');

QUnit.test('errorBuilder.getData()', function(assert) {
    var done = assert.async(2);
    setTimeout(function() {
        assert.ok(true, 'Should 1');
        assert.ok(true, 'Should 2');
        throw new Error('testError');
        done();
    }, 2000);
    setTimeout(function() {
        assert.ok(true, 'Should 3');
        assert.ok(true, 'Should 4');
        done();
    }, 4000);
});
QUnit.test('errorBuilder.getData().setName()', function(assert) {
    assert.ok(true, 'Should 5');
});
QUnit.test('errorBuilder.getData().getAge()', function(assert) {
    assert.ok(true, 'Should 6');
});
