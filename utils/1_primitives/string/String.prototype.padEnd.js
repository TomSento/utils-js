// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd
if (!String.prototype.padEnd) {
    String.prototype.padEnd = function(len, str) {
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
            return String(this) + str.slice(0, len);
        }
    };
}
