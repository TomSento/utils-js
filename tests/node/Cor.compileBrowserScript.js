var compileBrowserScript = require('../../dist/out.node.js').compileBrowserScript;
var fs = require('fs');

console.log(compileBrowserScript(fs.readFileSync('../../utils/2_core/Cor.h.js', 'utf8'))); // eslint-disable-line no-console
