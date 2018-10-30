/* eslint-disable no-console */
require('../../dist/out.node.js');

var Schema = $import('<Schema>');
var schema = malloc('schemas');

schema('User', new Schema({
    'name': {
        validate: function(v) {
            return typ.call(v) === '[object String]' && v.length > 5;
        }
    },
    'description': {
        prepare: function(v) {
            return v || null;
        },
        validate: function(v) {
            if (v === null) {
                return true;
            }
            return typ.call(v) === '[object String]';
        }
    },
    'projects': {
        validate: function(v) {
            return typ.call(v) === '[object Array]' && v && v.length > 0;
        }
    },
    'getName': {
        validate: function(v) {
            return typ.call(v) === '[object Function]';
        }
    }
}));

schema('Project', new Schema({
    'name': {
        validate: function(v) {
            return typ.call(v) === '[object String]' && v && v.length < 20;
        }
    }
}));

var user = {
    name: 'Tomas Sentkeresty',
    description: '',
    projects: ['project-1'],
    // getName: function() {},
    junk: 1
};
console.log('user:', user);

var err = schema('User').prepareValidate(user);

console.log('\nafter prepare & validate:', user);
var cleaned = schema('User').clean(user);
console.log('\ncleaned:', cleaned);
console.log('\ncleaned & stringified:', JSON.stringify(cleaned));

console.log('\ntop-level errors', err);
if (!err.projects) {
    var has;
    has = user.projects.find(function(v) {
        return typ.call(v) !== '[object Object]' || Object.keys(schema('Project').prepareValidate(v)).length > 0;
    });
    if (has) {
        err.projects = true;
    }
}
console.log('\nfinal errors', err);
