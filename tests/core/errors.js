require('../../dist/utils.all.js');

var errorBuilder = new $ErrorBuilder();
var err = new $Error('BuggsBunny-name', 'Parameter ...');
// err.throw();
$log(err.toString());
// new $Error('invalidParameter').logAndThrow();
errorBuilder.push(new $Error('BuggsBunny-name', 'Parameter "name" is missing or has incorrect format.'));
errorBuilder.push(new $Error(new Error('BuggsBunny-carrots'), 'Parameter "carrots" is missing or has incorrect format.'));
$log('Builder0: ', errorBuilder.toString());
errorBuilder.remove('BuggsBunny-carrots');
$log('Builder1: ', errorBuilder.toString());
errorBuilder.clear();
$log('Builder2: ', errorBuilder.toString());
