import $domIsEl from './domIsEl';

export default function $domHasClass(el, name) {
    if (!el || !$domIsEl(el)) {
        throw new Error('api-el');
    }
    if (el.classList) {
        return el.classList.contains(name);
    }
    else {
        var exp = new RegExp('(^| )' + name + '( |$)', 'gi');
        return exp.test(el.className);
    }
}
window.$domHasClass = $domHasClass;
