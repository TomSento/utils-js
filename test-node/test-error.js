var error = require('../utils/base.js').error;
var ErrorBuilder = require('../utils/base.js').ErrorBuilder;
var log = require('../utils/base.js').log;
var errorBuilder = new ErrorBuilder();

var err = error('BuggsBunny-name', 'Parameter ...');
// log(err.throw());
log(err.toString());
error('invalidParameter').logAndThrow();
errorBuilder.push(error('BuggsBunny-name', 'Parameter "name" is missing or has incorrect format.'));
errorBuilder.push(error(new Error('BuggsBunny-carrots'), 'Parameter "carrots" is missing or has incorrect format.'));
log('Builder0: ', errorBuilder.toString());
errorBuilder.remove('BuggsBunny-carrots');
log('Builder1: ', errorBuilder.toString());
errorBuilder.clear();
log('Builder2: ', errorBuilder.toString());
