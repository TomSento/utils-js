
// if (file.filename && file.contentType) {
//     var filename = $strRemoveExt(file.filename);
//     var ext =  $strContentTypeToExt(file.contentType);
//     if (filename && ext) {
//         $server().config.publicDirectory + '/upload/' + filename + ext;
//     }
// }

// self.mfd.forEach(function(entry) {
//     if (!entry.path) {
//         return;
//     }
//     var dir = '/upload/';
//     var fname = $uid1() + $strContentTypeToExt(entry.contentType);
//     var dest = $path.resolve($server().config.publicDirectory, dir, fname);
//     $fs.rename(entry.path, dest, function(err) {
//         if (err) {
//             return self.routeError(500);
//         }
//         $fs.stat(dest, function(err, stat) {
//             if (err) {
//                 return self.routeError(500);
//             }
//             saveToDB('photos', {
//                 name: fname,
//                 path: dir + fname,
//                 size: stat.size || 0
//             });
//         });
//     });
// });
// function saveToDB() {}
