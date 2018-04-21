var U = require('../../dist/utils.git');
var browsers = require('./files/test-useragent_browsers.json'); // FROM "ua-parser 0.7.17"
var engines = require('./files/test-useragent_engines.json');

U.arrForEach(browsers, function(test) {
    U.test('(browser) ' + test.desc, function(assert) {
        var v = U.userAgent(test.ua).browserName;
        assert.ok(v === test.expect.name, v, test.expect.name, '(browser/name) ' + test.desc);
        v = U.userAgent(test.ua).browserVersion;
        assert.ok(v === test.expect.version, v, test.expect.version, '(browser/version) ' + test.desc);
    });
});

U.arrForEach(engines, function(test) {
    U.test('(engine) ' + test.desc, function(assert) {
        var v = U.userAgent(test.ua).engineName;
        assert.ok(v === test.expect.name, v, test.expect.name, '(engine/name) ' + test.desc);
        v = U.userAgent(test.ua).engineVersion;
        assert.ok(v === test.expect.version, v, test.expect.version, '(engine/version) ' + test.desc);
    });
});

// engines = U.arrMap(engines, function(test) {
//     test.expect.name = strToSnakeCase(test.expect.name);
//     test.expect.version = strToSnakeCase(test.expect.version);
//     return test;
// });

// require('fs').writeFileSync('./files/test-useragent_engines-processed.json', JSON.stringify(engines, null, '    '));

// function strToSnakeCase(str) {
//     if (typeof(str) === 'string') {
//         return str.replace(/\s+/g, '_').toUpperCase() || null;
//     }
//     return null;
// }
