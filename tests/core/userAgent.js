var browsers = require('../files/userAgent_browsers.json'); // ----------> ALL TEST DATA FROM "ua-parser v0.7.17"
var engines = require('../files/userAgent_engines.json');
var os = require('../files/userAgent_os.json');
var devices = require('../files/userAgent_devices.json');
var cpu = require('../files/userAgent_cpu.json');

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

os.forEach(function(data) {
    var ua = userAgent(data.ua);
    if (ua.osName !== data.expect.name) log(`osName: ${data.desc}`);
    if (ua.osVersion !== data.expect.version) log(`osVersion: ${data.desc}`);
});

devices.forEach(function(data) {
    var ua = userAgent(data.ua);
    if (ua.deviceVendor !== data.expect.vendor) log(`deviceVendor: ${data.desc}`);
    if (ua.deviceModel !== data.expect.model) log(`deviceModel: ${data.desc}`);
    if (ua.deviceType !== data.expect.type) log(`deviceType: ${data.desc}`);
});

cpu.forEach(function(data) {
    if (userAgent(data.ua).cpu !== data.expect.architecture) log(`cpu: ${data.desc}`);
});
