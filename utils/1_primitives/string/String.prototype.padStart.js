// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
if (!String.prototype.padStart) {
    String.prototype.padStart = function(len, str) {
        len >>= 0; // eslint-disable-line no-bitwise
        str = String((typeof str !== 'undefined' ? str : ' '));
        if (this.length > len) {
            return String(this);
        }
        else {
            len -= this.length;
            if (len > str.length) {
                str += str.repeat(len / str.length);
            }
            return str.slice(0, len) + String(this);
        }
    };
}
