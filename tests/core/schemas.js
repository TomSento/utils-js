/* eslint-disable no-console */
var Schema = require('../../dist/out.node.js').Schema;

var User = new Schema({
    'name': {
        validate: function(v) {
            return typeof(v) === 'string' && v.length > 5;
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
            return typeof(v) === 'string';
        }
    },
    'projects': {
        validate: function(v) {
            return Array.isArray(v) && v.length > 0;
        }
    },
    'getName': {
        validate: function(v) {
            return typeof(v) === 'function';
        }
    }
});

var Project = new Schema({
    'name': {
        validate: function(v) {
            return !!v && typeof(v) === 'string' && v.length < 20;
        }
    }
});

var user = {
    name: 'Tomas Sentkeresty',
    description: '',
    projects: ['project-1'],
    // getName: function() {},
    junk: 1
};
console.log('user:', user);

var err = User.prepareValidate(user);

console.log('\nafter prepare & validate:', user);
var cleaned = User.clean(user);
console.log('\ncleaned:', cleaned);
console.log('\ncleaned & stringified:', JSON.stringify(cleaned));

console.log('\ntop-level errors', err);
if (!err.projects) {
    var has;
    has = user.projects.find(function(v) {
        return !v || v.constructor !== Object || Object.keys(Project.prepareValidate(v)).length > 0;
    });
    if (has) {
        err.projects = true;
    }
}
console.log('\nfinal errors', err);
