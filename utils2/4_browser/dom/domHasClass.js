import $domIsEl from './domIsEl';

export default function $domHasClass(el, name) {
    if (!el || !$domIsEl(el)) {
        throw new Error('api-el');
    }
    if (el.classList) {
        return el.classList.contains(name);
    }
    else if (el.className) {
        var exp = new RegExp('(^| )' + name + '( |$)', 'gi'); // -------------> IE8+
        return exp.test(el.className);
    }
    else {
        return false;
    }
}
window.$domHasClass = $domHasClass;
