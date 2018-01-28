var U = require('../dist/utils.git');

var SchemaOne = U.Schema(function(attr, attrError, attrPrepare, attrValidate, func, funcError) {
    attr('name', String);
    attrValidate(function(v, typeMatch) {
        return typeMatch && v.length > 5;
    });
    attrError('Parameter "name" is missing or has incorrect format.');
    attrError('SK', 'Paremeter "name" chýba alebo má nesprávny formát.');
    attrError('CZ', 'Parametr "name" chybí nebo má špatný formát.');
    attr('rewards', String);
    attrError('Parameter "surname" has incorrect format.');
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
    func('getName');
    funcError('Function "getName" is missing.');
    funcError('SK', 'Chýba funkcia "getName".');
});
var obj = {
    name: 'Tomas',
    // surname: undefined,
    projects: []
    // getName: function() {}
};
var errors = SchemaOne.prepareAndValidate(obj, 'SK');
U.log('errors default sk locale: ', errors);
if (errors.hasError()) {
    // errors.throwFirst();
}
U.log('before normalize: ', obj);
var norm = SchemaOne.normalize(obj);
U.log('normalized: ', norm);
