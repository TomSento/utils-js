require('../../dist/utils.all.js');

var browsers = require('../files/userAgent_browsers.json'); // ----------> ALL TEST DATA FROM "ua-parser v0.7.17"
var engines = require('../files/userAgent_engines.json');
var os = require('../files/userAgent_os.json');
var devices = require('../files/userAgent_devices.json');
var cpu = require('../files/userAgent_cpu.json');

$arrForEach(browsers, function(test) {
    $test('(browser) ' + test.desc, function(assert) {
        var v = $userAgent(test.ua).browserName;
        assert.ok(v === test.expect.name, v, test.expect.name, '(browser/name) ' + test.desc);
        v = $userAgent(test.ua).browserVersion;
        assert.ok(v === test.expect.version, v, test.expect.version, '(browser/version) ' + test.desc);
    });
});

$arrForEach(engines, function(test) {
    $test('(engine) ' + test.desc, function(assert) {
        var v = $userAgent(test.ua).engineName;
        assert.ok(v === test.expect.name, v, test.expect.name, '(engine/name) ' + test.desc);
        v = $userAgent(test.ua).engineVersion;
        assert.ok(v === test.expect.version, v, test.expect.version, '(engine/version) ' + test.desc);
    });
});

$arrForEach(os, function(test) {
    $test('(os) ' + test.desc, function(assert) {
        var v = $userAgent(test.ua).osName;
        assert.ok(v === test.expect.name, v, test.expect.name, '(os/name) ' + test.desc);
        v = $userAgent(test.ua).osVersion;
        assert.ok(v === test.expect.version, v, test.expect.version, '(os/version) ' + test.desc);
    });
});

$arrForEach(devices, function(test) {
    $test('(device) ' + test.desc, function(assert) {
        var v = $userAgent(test.ua).deviceVendor;
        assert.ok(v === test.expect.vendor, v, test.expect.vendor, '(device/vendor) ' + test.desc);
        v = $userAgent(test.ua).deviceModel;
        assert.ok(v === test.expect.model, v, test.expect.model, '(device/model) ' + test.desc);
        v = $userAgent(test.ua).deviceType;
        assert.ok(v === test.expect.type, v, test.expect.type, '(device/type) ' + test.desc);
    });
});

$arrForEach(cpu, function(test) {
    $test('(cpu) ' + test.desc, function(assert) {
        var v = $userAgent(test.ua).cpu;
        assert.ok(v === test.expect.architecture, v, test.expect.architecture, '(cpu) ' + test.desc);
    });
});
