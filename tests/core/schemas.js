require('../../dist/utils.all.js');

$schema('User', 'EN', {
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

$logDebug('obj:', obj);
var err = $schema('User').prepareAndValidate(obj, 'SK');
if (err.hasError()) {
    $log('Schema has ' + err.errors.length + ' error(s).');
}
$logDebug(err);
$logDebug('prepare & validate:', obj);
$logDebug('cleaned:', $schema('User').clean(obj));
$logDebug('Make error on fly: ', $schema('User').makeError('getName', 'SK'));
