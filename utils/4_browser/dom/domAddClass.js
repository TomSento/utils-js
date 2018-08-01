import $toArrayOfElements from './internal/toArrayOfElements';

export default function $domAddClass(sel, v) {
    if (!sel) {
        throw new Error('api-sel');
    }
    if (!v || typeof(v) !== 'string') {
        throw new Error('api-v');
    }
    var els = $toArrayOfElements(sel);
    for (var i = 0, l = els.length; i < l; i++) {
        var el = els[i];
        if (el) {
            addClasses(el);
        }
    }
    function addClasses(el) { // ---------------------------------------------> ADDS 0..N CLASSES
        var classes = v.split(/\s+/);
        for (var i = 0, l = classes.length; i < l; i++) {
            var cls = classes[i];
            if (cls) {
                el.classList.add(cls); // ------------------------------------> https://developer.mozilla.org/en-US/docs/Web/API/Element/classList#Methods
            }
        }
    }
}
window.$domAddClass = $domAddClass;