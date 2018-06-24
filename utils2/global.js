function getGlobal() {
    return (typeof(global) === 'object') ? global : window;
}
module.exports = getGlobal;
