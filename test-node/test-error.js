var U = require('../dist/utils.git');

var errorBuilder = new U.ErrorBuilder();
var err = new U.Error('BuggsBunny-name', 'Parameter ...');
// err.throw();
U.log(err.toString());
// new U.Error('invalidParameter').logAndThrow();
errorBuilder.push(new U.Error('BuggsBunny-name', 'Parameter "name" is missing or has incorrect format.'));
errorBuilder.push(new U.Error(new Error('BuggsBunny-carrots'), 'Parameter "carrots" is missing or has incorrect format.'));
U.log('Builder0: ', errorBuilder.toString());
errorBuilder.remove('BuggsBunny-carrots');
U.log('Builder1: ', errorBuilder.toString());
errorBuilder.clear();
U.log('Builder2: ', errorBuilder.toString());
