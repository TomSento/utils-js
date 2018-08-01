if (!Object.keys) {
    Object.keys = function(obj) {
        var keys = [];
        var k;
        for (k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };
}
