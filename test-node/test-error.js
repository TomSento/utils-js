var U = require('../dist/utils.git');

var errorBuilder = U.ErrorBuilder();
var err = U.error('BuggsBunny-name', 'Parameter ...');
// log(err.throw());
U.log(err.toString());
U.error('invalidParameter').logAndThrow();
errorBuilder.push(U.error('BuggsBunny-name', 'Parameter "name" is missing or has incorrect format.'));
errorBuilder.push(U.error(new Error('BuggsBunny-carrots'), 'Parameter "carrots" is missing or has incorrect format.'));
U.log('Builder0: ', errorBuilder.toString());
errorBuilder.remove('BuggsBunny-carrots');
U.log('Builder1: ', errorBuilder.toString());
errorBuilder.clear();
U.log('Builder2: ', errorBuilder.toString());
