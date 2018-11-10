import * as $fs from 'fs';

export default function Watcher(t) {
    this.t = t;
    this.fn = {};
    this.trigger = function(k, a1, a2, a3) {
        var fn = this.fn[k];
        return fn && fn(a1, a2, a3);
    };
}
Watcher.prototype = {
    watch: function(filepath) {
        var self = this;
        $fs.watchFile(filepath, {
            interval: self.t || 1000 // --------------------------------------> DEFAULT: POLL EACH SECOND
        }, function(curr, prev) {
            if (curr && prev && curr.mtime !== prev.mtime) {
                return self.trigger('change', filepath, curr, prev);
            }
        });
    },
    on: function(k, fn) {
        this.fn[k] = fn;
    }
};
if (!global.Cor) global.Cor = {};
global.Cor.Watcher = Watcher;
