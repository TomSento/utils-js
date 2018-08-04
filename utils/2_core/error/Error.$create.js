Error.$create = function(name, message) {
    var err = new Error(message || '');
    err.name = name;
    return err;
};
