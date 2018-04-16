var U = require('../../dist/utils.git');
var browsers = require('./files/test-useragent_browsers.json'); // FROM "ua-parser 0.7.17"

U.arrForEach(browsers, function(test) {
    U.test(test.desc, function(assert) {
        var v = U.userAgent(test.ua).browserName;
        assert.ok(v === test.expect.name, v, test.expect.name, '(name) ' + test.desc);
        v = U.userAgent(test.ua).browserVersion;
        assert.ok(v === test.expect.version, v, test.expect.version, '(version) ' + test.desc);
    });
});
