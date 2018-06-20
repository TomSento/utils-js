var U = require('../../dist/utils.git.js');

U.SETSCHEMA('User', function(attr, attrError, attrPrepare, attrValidate, prefix) {
    attr('name', String);
    attrValidate(function(v, typeMatch) {
        return typeMatch && v.length > 5;
    });
    attrError('Parameter "name" is missing or has incorrect format.');
    attrError('SK', 'Paremeter "name" chýba alebo má nesprávny formát.');
    attrError('CZ', 'Parametr "name" chybí nebo má špatný formát.');
    attr('description', String);
    attrError('Parameter "description" has incorrect format.');
    attrPrepare(function(v) {
        return v || null; // PREPARE TO BAD TYPE WILL CAUSE TYPE MISSMATCH IN VALIDATE STEP
    });
    attrValidate(function(v, typeMatch) {
        if (v === null) {
            return true;
        }
        return typeMatch;
    });
    attr('projects', Array);
    attrError('Parameter "projects" must be an array with at least one item.'); // WHEN ERROR MESSAGE FOR 'SK' LANGUAGE IS NOT FOUND -> FALLBACK TO DEFAULT attrError() MESSAGE
    attrValidate(function(arr, typeMatch) {
        if (!arr) {
            return false;
        }
        return typeMatch && arr.length > 0;
    });
    attr('getName', Function);
    attrError('Function "getName" is missing.');
    attrError('SK', 'Chýba funkcia "getName".');
    attrValidate(function(v, typeMatch) {
        return typeMatch;
    });
    prefix('schemaUser-');
});
var obj = {
    name: 'Tomas Sentkeresty',
    description: '',
    projects: [1]
    // getName: function() {}
};
var err = U.SCHEMA('User').prepareAndValidate(obj, 'SK');
if (err.hasError()) {
    U.log('Schema has ' + err.errors.length + ' error(s).');
}
U.logDebug(err);
U.logDebug(obj);
U.log('Make error on fly: ' + U.SCHEMA('User').makeError('getName', 'SK'));
