require('../../dist/utils.node.js');

var browsers = require('../files/userAgent_browsers.json'); // ----------> ALL TEST DATA FROM "ua-parser v0.7.17"
var engines = require('../files/userAgent_engines.json');
var os = require('../files/userAgent_os.json');
var devices = require('../files/userAgent_devices.json');
var cpu = require('../files/userAgent_cpu.json');

var test = $import('<test>');
var userAgent = $import('<userAgent>');

browsers.forEach(function(data) {
    test('(browser) ' + data.desc, function(assert) {
        var v = userAgent(data.ua).browserName;
        assert.ok(v === data.expect.name, v, data.expect.name, '(browser/name) ' + data.desc);
        v = userAgent(data.ua).browserVersion;
        assert.ok(v === data.expect.version, v, data.expect.version, '(browser/version) ' + data.desc);
    });
});

engines.forEach(function(data) {
    test('(engine) ' + data.desc, function(assert) {
        var v = userAgent(data.ua).engineName;
        assert.ok(v === data.expect.name, v, data.expect.name, '(engine/name) ' + data.desc);
        v = userAgent(data.ua).engineVersion;
        assert.ok(v === data.expect.version, v, data.expect.version, '(engine/version) ' + data.desc);
    });
});

os.forEach(function(data) {
    test('(os) ' + data.desc, function(assert) {
        var v = userAgent(data.ua).osName;
        assert.ok(v === data.expect.name, v, data.expect.name, '(os/name) ' + data.desc);
        v = userAgent(data.ua).osVersion;
        assert.ok(v === data.expect.version, v, data.expect.version, '(os/version) ' + data.desc);
    });
});

devices.forEach(function(data) {
    test('(device) ' + data.desc, function(assert) {
        var v = userAgent(data.ua).deviceVendor;
        assert.ok(v === data.expect.vendor, v, data.expect.vendor, '(device/vendor) ' + data.desc);
        v = userAgent(data.ua).deviceModel;
        assert.ok(v === data.expect.model, v, data.expect.model, '(device/model) ' + data.desc);
        v = userAgent(data.ua).deviceType;
        assert.ok(v === data.expect.type, v, data.expect.type, '(device/type) ' + data.desc);
    });
});

cpu.forEach(function(data) {
    test('(cpu) ' + data.desc, function(assert) {
        var v = userAgent(data.ua).cpu;
        assert.ok(v === data.expect.architecture, v, data.expect.architecture, '(cpu) ' + data.desc);
    });
});
