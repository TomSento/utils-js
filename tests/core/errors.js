/* eslint-disable no-console */
require('../../dist/utils.node.js');

var errors = new $ErrorBuilder();
var err = new $Error('User-name', 'Parameter ...');
// err.throw();
// err.logAndThrow();
console.log(err.toString());

errors.push(new $Error('User-name', 'Parameter "name" is missing or has incorrect format.'));
errors.push(new $Error(new Error('User-phone'), 'Parameter "phone" is missing or has incorrect format.'));
console.log('Builder0: ', errors.toString());

errors.remove('User-phone');
console.log('Builder1: ', errors.toString());

errors.clear();
console.log('Builder2: ', errors.toString());
