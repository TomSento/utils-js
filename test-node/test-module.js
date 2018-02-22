var U = require('../dist/utils.git');

U.SETMODULE('Wallet', function(func) {
    func('plus', function(p1, p2) {
        return p1 + p2;
    });
    func('calcPriceWithTax', function(p1, p2, next) {
        var total = p1 + p2;
        asyncGetTax(function(tax) {
            total *= tax;
            return next(null, total);
        });
    });
    function asyncGetTax(next) {
        setTimeout(function() {
            return next(1.2);
        }, 1000);
    }
});

U.test('module.func (sync)', function(assert) {
    var v = U.MODULE('Wallet').func('plus', 2, 3);
    assert.ok(v === 5, 'Sync function processes multiple arguments and returns expected result.');
});

U.test('module.func (async)', function(assert) {
    var next = assert.async(1);
    U.MODULE('Wallet').func('calcPriceWithTax', 2, 3, function(err, v) {
        assert.ok(v === 6, 'Async function processes multiple arguments and returns expected result.');
        next();
    });
});
