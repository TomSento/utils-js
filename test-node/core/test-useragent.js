var U = require('../../dist/utils.git');
var browsers = require('./files/test-useragent_browsers.json'); // FROM "ua-parser 0.7.17"

U.arrForEach(browsers, function(test) {
    U.test('(browser) ' + test.desc, function(assert) {
        var v = U.userAgent(test.ua).browserName;
        assert.ok(v === test.expect.name, v, test.expect.name, '(browser/name) ' + test.desc);
        v = U.userAgent(test.ua).browserVersion;
        assert.ok(v === test.expect.version, v, test.expect.version, '(browser/version) ' + test.desc);
    });
});

// browsers = U.arrMap(browsers, function(test) {
//     test.expect.name = strToSnakeCase(test.expect.name);
//     test.expect.version = strToSnakeCase(test.expect.version);
//     return test;
// });

// require('fs').writeFileSync('./files/test-useragent_browsers-processed.json', JSON.stringify(browsers, null, '    '));

// function strToSnakeCase(str) {
//     if (typeof(str) === 'string') {
//         return str.replace(/\s+/g, '_').toUpperCase() || null;
//     }
//     return null;
// }
