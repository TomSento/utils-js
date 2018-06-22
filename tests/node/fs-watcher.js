require('../../dist/utils.all.js');

var w = new $Watcher();
w.watch('../files/watchme1.md');
w.watch('../files/watchme2.md');
w.on('change', function(filepath, prev, curr) {
    $log('filepath: ' + filepath);
    $log('prev:', prev);
    $log('curr:', curr);
});
