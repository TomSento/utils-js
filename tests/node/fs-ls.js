/* eslint-disable no-console */
require('../../dist/out.node.js');

var ls = $import('<ls>');

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
