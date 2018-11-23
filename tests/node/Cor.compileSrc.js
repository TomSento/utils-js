var compileSrc = require('../../dist/out.node.js').compileSrc;
var fs = require('fs');

console.log(compileSrc(fs.readFileSync('../../utils/2_core/Cor.h.js', 'utf8'))); // eslint-disable-line no-console
