var U = require('../../dist/utils.git');

var browsers = require('./files/test-useragent_browsers.json'); // -----------> ALL TEST DATA FROM "ua-parser v0.7.17"
var engines = require('./files/test-useragent_engines.json');
var os = require('./files/test-useragent_os.json');
var devices = require('./files/test-useragent_devices.json');
var cpu = require('./files/test-useragent_cpu.json');

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

U.arrForEach(os, function(test) {
    U.test('(os) ' + test.desc, function(assert) {
        var v = U.userAgent(test.ua).osName;
        assert.ok(v === test.expect.name, v, test.expect.name, '(os/name) ' + test.desc);
        v = U.userAgent(test.ua).osVersion;
        assert.ok(v === test.expect.version, v, test.expect.version, '(os/version) ' + test.desc);
    });
});

U.arrForEach(devices, function(test) {
    U.test('(device) ' + test.desc, function(assert) {
        var v = U.userAgent(test.ua).deviceVendor;
        assert.ok(v === test.expect.vendor, v, test.expect.vendor, '(device/vendor) ' + test.desc);
        v = U.userAgent(test.ua).deviceModel;
        assert.ok(v === test.expect.model, v, test.expect.model, '(device/model) ' + test.desc);
        v = U.userAgent(test.ua).deviceType;
        assert.ok(v === test.expect.type, v, test.expect.type, '(device/type) ' + test.desc);
    });
});

U.arrForEach(cpu, function(test) {
    U.test('(cpu) ' + test.desc, function(assert) {
        var v = U.userAgent(test.ua).cpu;
        assert.ok(v === test.expect.architecture, v, test.expect.architecture, '(cpu) ' + test.desc);
    });
});
