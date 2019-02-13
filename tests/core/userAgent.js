var browsers = require('../files/userAgent_browsers.json'); // ----------> ALL TEST DATA FROM "ua-parser v0.7.17"
var engines = require('../files/userAgent_engines.json');
var os = require('../files/userAgent_os.json');
var devices = require('../files/userAgent_devices.json');
var cpu = require('../files/userAgent_cpu.json');

var test = require('../../dist/out.node.js').test;
var userAgent = require('../../dist/out.node.js').userAgent;

function log(arg) {
    console.log('\x1b[31m' + arg + '\x1b[0m');
}

browsers.forEach(function(data) {
    var ua = userAgent(data.ua);
    if (ua.browserName !== data.expect.name) log(`browserName: ${data.desc}`);
    if (ua.browserVersion !== data.expect.version) log(`browserVersion: ${data.desc}`);
});

engines.forEach(function(data) {
    var ua = userAgent(data.ua);
    if (ua.engineName !== data.expect.name) log(`engineName: ${data.desc}`);
    if (ua.engineVersion !== data.expect.version) log(`engineVersion: ${data.desc}`);
});

// os.forEach(function(data) {
//     test('(os) ' + data.desc, function(assert) {
//         var v = userAgent(data.ua).osName;
//         assert.ok(v === data.expect.name, v, data.expect.name, '(os/name) ' + data.desc);
//         v = userAgent(data.ua).osVersion;
//         assert.ok(v === data.expect.version, v, data.expect.version, '(os/version) ' + data.desc);
//     });
// });

// devices.forEach(function(data) {
//     test('(device) ' + data.desc, function(assert) {
//         var v = userAgent(data.ua).deviceVendor;
//         assert.ok(v === data.expect.vendor, v, data.expect.vendor, '(device/vendor) ' + data.desc);
//         v = userAgent(data.ua).deviceModel;
//         assert.ok(v === data.expect.model, v, data.expect.model, '(device/model) ' + data.desc);
//         v = userAgent(data.ua).deviceType;
//         assert.ok(v === data.expect.type, v, data.expect.type, '(device/type) ' + data.desc);
//     });
// });

// cpu.forEach(function(data) {
//     test('(cpu) ' + data.desc, function(assert) {
//         var v = userAgent(data.ua).cpu;
//         assert.ok(v === data.expect.architecture, v, data.expect.architecture, '(cpu) ' + data.desc);
//     });
// });
