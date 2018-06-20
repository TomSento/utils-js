var U = require('../../dist/utils.git.js');

U.SCHEMA2('User', 'EN', {
    'name': [String, {
        validate: function(v, typeMatch) {
            return typeMatch && v.length > 5;
        },
        'EN': 'Parameter "name" is missing or has incorrect format.',
        'SK': 'Paremeter "name" chýba alebo má nesprávny formát.',
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

var obj = {
    name: 'Tomas Sentkeresty',
    description: '',
    projects: {},
    // getName: function() {},
    junk: 1
};

U.logDebug('obj:', obj);
var err = U.SCHEMA2('User').prepareAndValidate(obj, 'SK');
if (err.hasError()) {
    U.log('Schema has ' + err.errors.length + ' error(s).');
}
U.logDebug(err);
U.logDebug('prepare & validate:', obj);
U.logDebug('cleaned:', U.SCHEMA2('User').clean(obj));
U.logDebug('Make error on fly: ', U.SCHEMA2('User').makeError('getName', 'SK'));
