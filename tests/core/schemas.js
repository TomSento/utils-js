/* eslint-disable no-console */
require('../../dist/utils.node.js');

var Schema = $import('<Schema>');
var schema = malloc('schemas');

schema('User', new Schema('EN', {
    'name': {
        validate: function(v) {
            return typ.call(v) === '[object String]' && v.length > 5;
        },
        'EN': 'Parameter "name" is missing or has incorrect format.',
        'SK': 'Parameter "name" chýba alebo má nesprávny formát.',
        'CZ': 'Parametr "name" chybí nebo má špatný formát.'
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
        },
        'EN': 'Parameter "description" has incorrect format.'
    },
    'projects': {
        validate: function(v) {
            return typ.call(v) === '[object Array]' && v && v.length > 0;
        },
        'EN': 'Parameter "projects" must be an array with at least one item.'
    },
    'getName': {
        validate: function(v) {
            return typ.call(v) === '[object Function]';
        },
        'EN': 'Function "getName" is missing.',
        'SK': 'Chýba funkcia "getName".'
    }
}));

schema('Project', new Schema('EN', {
    'name': [String, {
        validate: function(v) {
            return typ.call(v) === '[object String]' && v && v.length < 20;
        }
    }]
}));

var user = {
    name: 'Tomas Sentkeresty',
    description: '',
    projects: ['project-1'],
    // getName: function() {},
    junk: 1
};
console.log('user:', user);

var lan = 'SK';
var err = schema('User').prepareValidate(user, lan);

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
        err.projects = schema('User').error('projects', lan);
    }
}
console.log('\nfinal errors', err);
