exports.$uid1 = function() {
    return ['' + new Date().getFullYear(), ('' + (new Date().getMonth() + 1)).padStart(2, '0'), ('' + (new Date().getDate())).padStart(2, '0'), ('' + (new Date().getHours())).padStart(2, '0'), ('' + (new Date().getMinutes())).padStart(2, '0'), Math.random().toString(36).slice(2, 8)].join('-');
};
exports.$uid2 = function() {
    return [Math.random().toString(36).slice(2, 8), Math.random().toString(36).slice(2, 8), Math.random().toString(36).slice(2, 8), Math.random().toString(36).slice(2, 8)].join('-');
};
