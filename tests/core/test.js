require('../../dist/utils.node.js');

var test = $import('<test>');

test('errorBuilder.getData()', function(assert) {
    var done = assert.async(2);
    assert.expect(4);
    // throw new Error('aaaa');
    setTimeout(function() {
        assert.ok(true, 'ACTUAL0', 'EXPECTED0', 'ASSERT0');
        assert.ok(false, 'ACTUAL1', 'EXPECTED1', 'ASSERT1');
        done();
    }, 15000);
    setTimeout(function() {
        assert.ok(true, 'ACTUAL2', 'EXPECTED2', 'ASSERT2');
        assert.ok(false, 'ACTUAL3', 'EXPECTED3', 'ASSERT3');
        done();
    }, 17000);
}, 17000);
test('errorBuilder.getData().setName()', function(assert) {
    assert.expect(1);
    assert.ok(true, 'ACTUAL4', 'EXPECTED4', 'ASSERT4');
    // throw new Error('terminateTesting');
});
test('errorBuilder.getData().getAge()', function(assert) {
    assert.ok(true, 'ACTUAL5', 'EXPECTED5', 'ASSERT5');
});
