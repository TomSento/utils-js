/* eslint-disable no-console */
require('../../dist/out.node.js');

var Watcher = $import('<Watcher>');

var w = new Watcher();
w.watch('../files/watchme1.md');
w.watch('../files/watchme2.md');

w.on('change', function(filepath, prev, curr) {
    console.log('filepath: ' + filepath);
    console.log('prev:', prev);
    console.log('curr:', curr);
});
