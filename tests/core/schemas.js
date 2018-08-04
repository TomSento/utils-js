/* eslint-disable no-console */
require('../../dist/utils.node.js');

$schema('User', 'EN', {
    'name': [String, {
        validate: function(v, typeMatch) {
            return typeMatch && v.length > 5;
        },
        'EN': 'Parameter "name" is missing or has incorrect format.',
        'SK': 'Parameter "name" chýba alebo má nesprávny formát.',
        'CZ': 'Parametr "name" chybí nebo má špatný formát.'
    }],
    'description': [String, {
        prepare: function(v) {
            return v || null;
        },
        validate: function(v, typeMatch) {
            if (v === null) {
                return true;
            }
            return typeMatch;
        },
        'EN': 'Parameter "description" has incorrect format.'
    }],
    'projects': [Array, {
        validate: function(v, typeMatch) {
            return typeMatch && v && v.length > 0;
        },
        'EN': 'Parameter "projects" must be an array with at least one item.'
    }],
    'getName': [Function, {
        validate: function(v, typeMatch) {
            return typeMatch;
        },
        'EN': 'Function "getName" is missing.',
        'SK': 'Chýba funkcia "getName".'
    }]
});

$schema('Project', 'EN', {
    'name': [String, {
        validate: function(v, typeMatch) {
            return typeMatch && v && v.length < 20;
        }
    }]
});

var user = {
    name: 'Tomas Sentkeresty',
    description: '',
    projects: ['project-1'],
    // getName: function() {},
    junk: 1
};
console.log('user:', user);

var lan = 'SK';
var err = $schema('User').prepareValidate(user, lan);

console.log('\nafter prepare & validate:', user);
var cleaned = $schema('User').clean(user);
console.log('\ncleaned:', cleaned);
console.log('\ncleaned & stringified:', JSON.stringify(cleaned));

console.log('\ntop-level errors', err);
if (!err.projects) {
    var has;
    has = user.projects.find(function(v) {
        return $type(v) !== 'object' || Object.keys($schema('Project').prepareValidate(v)).length > 0;
    });
    if (has) {
        err.projects = $schema('User').error('projects', lan);
    }
}
console.log('\nfinal errors', err);
