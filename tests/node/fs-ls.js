/* eslint-disable no-console */
var ls = require('../../dist/out.node.js').ls;

ls([
    '../../utils',
    '../../tests/node'
], 'R', function(path, stat, next) {
    console.log('path: ' + path);
    next();
}, function(err) {
    if (err) {
        throw err;
    }
    console.log('DONE');
});
