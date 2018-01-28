exports.domReady = function(fn) {
    if (document.attachEvent ? (document.readyState === "complete") : (document.readyState !== "loading")) {
        fn();
    }
    else {
        document.addEventListener('DOMContentLoaded', fn);
    }
};
exports.domIsEl = function(el) {
    return (el instanceof Node || el instanceof Element || el instanceof HTMLDocument);
};
exports.domMatches = function(el, sel) { // https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
    var p = Element.prototype;
    var fn = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function(s) {
        return Array.prototype.indexOf.call(document.querySelectorAll(s), this) !== -1;
    };
    return fn.call(el, sel);
};
/**
 * @param {String} sel
 * @param {Element} el
 * @returns {Array}
 */
exports.domFind = function(sel, el) {
    var list = null;
    if (!sel || typeof(sel) !== 'string') {
        throw new Error('invalidParameter');
    }
    if (el && exports.domIsEl(el)) {
        list = el.querySelectorAll(sel);
    }
    else {
        list = document.querySelectorAll(sel);
    }
    if (list) {
        if (selectingOne(sel)) {
            return list[0] || null;
        }
        else {
            var arr = [];
            var len = list.length;
            arr.length = len;
            for (var i = 0; i < len; i++) {
                if (list[i]) {
                    arr[i] = list[i];
                }
            }
            return arr;
        }
    }
    else {
        if (selectingOne(sel)) {
            return null;
        }
        return [];
    }
    function selectingOne(sel) {
        if (exports.domIsEl(sel)) {
            return true;
        }
        else if (typeof(sel) === 'string') {
            var parts = sel.split(/\s+/);
            return (parts && parts.length == 1 && parts[0][0] == '#');
        }
        return false;
    }
};
exports.domHasClass = function(el, name) {
    if (!el || !exports.domIsEl(el)) {
        throw new Error('invalidParameter');
    }
    if (el.classList) {
        return el.classList.contains(name);
    }
    else {
        var exp = new RegExp('(^| )' + name + '( |$)', 'gi');
        return exp.test(el.className);
    }
};
exports.domAddClass = function(sel, v) {
    if (!sel) {
        throw new Error('invalidParameter');
    }
    if (!v || typeof(v) !== 'string') {
        return new Error('invalidParameter');
    }
    var els = null;
    if (Array.isArray(sel)) {
        els = sel;
    }
    else if (exports.domIsEl(sel)) {
        els = [sel];
    }
    else {
        els = exports.domFind(sel);
        els = Array.isArray(els) ? els : [els];
    }
    if (Array.isArray(els)) {
        var len = els.length;
        for (var i = 0; i < len; i++) {
            var el = els[i];
            if (!el) {
                continue;
            }
            var clas = v.split(/\s+/);
            var lenlen = clas.length;
            for (var j = 0; j < lenlen; j++) {
                var cla = clas[j];
                addClass(el, cla);
            }
        }
    }
    function addClass(el, v) {
        if (el.classList) {
            el.classList.add(v);
        }
        else {
            el.className += ' ' + v;
        }
    }
};
exports.domRemoveClass = function(sel, v) {
    if (!sel || !v || typeof(v) !== 'string') {
        return new Error('invalidParameter');
    }
    var els = null;
    if (Array.isArray(sel)) {
        els = sel;
    }
    else if (exports.domIsEl(sel)) {
        els = [sel];
    }
    else {
        els = exports.domFind(sel);
        els = Array.isArray(els) ? els : [els];
    }
    if (Array.isArray(els)) {
        var len = els.length;
        for (var i = 0; i < len; i++) {
            var el = els[i];
            if (!el) {
                continue;
            }
            var clas = v.split(/\s+/);
            var lenlen = clas.length;
            for (var j = 0; j < lenlen; j++) {
                var cla = clas[j];
                removeClass(el, cla);
            }
        }
    }
    function removeClass(el, v) {
        if (el.classList) {
            el.classList.remove(v);
        }
        else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + v.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }
},
exports.domToggleClass = function(sel, v) {
    if (!sel) {
        throw new Error('invalidParameter');
    }
    if (!v || typeof(v) !== 'string') {
        return new Error('invalidParameter');
    }
    var els = null;
    if (Array.isArray(sel)) {
        els = sel;
    }
    else if (exports.domIsEl(sel)) {
        els = [sel];
    }
    else {
        els = exports.domFind(sel);
        els = Array.isArray(els) ? els : [els];
    }
    if (Array.isArray(els)) {
        var len = els.length;
        for (var i = 0; i < len; i++) {
            var el = els[i];
            if (!el) {
                continue;
            }
            var clas = v.split(/\s+/);
            var lenlen = clas.length;
            for (var j = 0; j < lenlen; j++) {
                var cla = clas[j];
                toggleClass(el, cla);
            }
        }
    }
    function toggleClass(el, v) {
        el.classList.toggle(v);
    }
};
exports.domVal = function(sel, v) {
    if (!sel) {
        throw new Error('invalidParameter');
    }
    if (v && typeof(v) !== 'string' && isNaN(v)) {
        return new Error('invalidParameter');
    }
    var els = null;
    if (Array.isArray(sel)) {
        els = sel;
    }
    else if (exports.domIsEl(sel)) {
        els = [sel];
    }
    else {
        els = exports.domFind(sel);
        els = Array.isArray(els) ? els : [els];
    }
    var arr = [];
    if (Array.isArray(els)) {
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            if (!el) {
                continue;
            }
            if (v === undefined) {
                arr.push(getVal(el));
            }
            else {
                setVal(el, v);
            }
        }
    }
    return selectingOne(sel) ? arr[0] : arr;
    function getVal(el) {
        return el.value || null;
    }
    function setVal(el, v) {
        if (v === undefined) {
            return el.value;
        }
        else {
            el.value = v;
        }
    }
    function selectingOne(sel) {
        if (exports.domIsEl(sel)) {
            return true;
        }
        else if (typeof(sel) === 'string') {
            var parts = sel.split(/\s+/);
            return (parts && parts.length == 1 && parts[0][0] == '#');
        }
        return false;
    }
};
exports.domAttr = function(sel, k, v) {
    if (!sel) {
        throw new Error('invalidParameter');
    }
    if (!k || typeof(k) !== 'string') {
        throw new Error('invalidParameter');
    }
    if (v && typeof(v) !== 'string' && isNaN(v) && typeof(v) !== null) {
        throw new Error('invalidParameter')
    }
    var els = null;
    if (Array.isArray(sel)) {
        els = sel;
    }
    else if (exports.domIsEl(sel)) {
        els = [sel];
    }
    else {
        els = exports.domFind(sel);
        els = Array.isArray(els) ? els : [els];
    }
    var arr = [];
    if (Array.isArray(els)) {
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            if (!el) {
                continue;
            }
            if (v === undefined) {
                arr.push(getAttr(el, k));
            }
            else {
                setAttr(el, k, v);
            }
        }
    }
    return selectingOne(sel) ? arr[0] : arr;
    function getAttr(el, k) {
        var v = el.getAttribute(k) || null;
        if (v) {
            return v;
        }
        else {
            return el.hasAttribute(k);
        }
    }
    function setAttr(el, k, v) {
        el.setAttribute(k, '' + v);
    }
    function selectingOne(sel) {
        if (exports.domIsEl(sel)) {
            return true;
        }
        else if (typeof(sel) === 'string') {
            var parts = sel.split(/\s+/);
            return (parts && parts.length == 1 && parts[0][0] == '#');
        }
        return false;
    }
};
exports.domData = function(sel, k, v) {
    if (!sel) {
        throw new Error('invalidParameter');
    }
    if (!k || typeof(k) !== 'string') {
        throw new Error('invalidParameter');
    }
    try {
        v = normalizeVal(v);
    } catch (err) {
        throw new Error('unableToParse');
    }
    var els = null;
    if (Array.isArray(sel)) {
        els = sel;
    }
    else if (exports.domIsEl(sel)) {
        els = [sel];
    }
    else {
        els = exports.domFind(sel);
        els = Array.isArray(els) ? els : [els];
    }
    var arr = [];
    if (Array.isArray(els)) {
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            if (!el) {
                continue;
            }
            if (v === undefined) {
                arr.push(getData(el, k));
            }
            else {
                setData(el, k, v);
            }
        }
    }
    return selectingOne(sel) ? arr[0] : arr;
    function getData(el, k) {
        if (el.__elementData && el.__elementData[k]) {
            return el.__elementData[k];
        }
        return el.dataset[k] || null;
    }
    function setData(el, k, v) {
        if (typeof(v) === 'string') {
            el.dataset[k] = v;
        }
        else {
            if (!el.__elementData) {
                el.__elementData = {};
            }
            el.__elementData[k] = v;
        }
    }
    function normalizeVal(v) {
        if (v === undefined) {
            return undefined;
        }
        else if (typeof(v) === 'string') {
            return v;
        }
        else if (typeof(v) === 'object') {
            if (!v) {
                return null;
            }
            return v;
        }
        else if (v && typeof(v.toString) == 'function') {
            return v.toString();
        }
        else {
            throw new Error('invalidParameter');
        }
    }
    function selectingOne(sel) {
        if (exports.domIsEl(sel)) {
            return true;
        }
        else if (typeof(sel) === 'string') {
            var parts = sel.split(/\s+/);
            return (parts && parts.length == 1 && parts[0][0] == '#');
        }
        return false;
    }
};
exports.domHTML = function(sel, v) {
    if (!sel) {
        throw new Error('invalidParameter');
    }
    if (v && typeof(v) !== 'string') {
        return new Error('invalidParameter');
    }
    var els = null;
    if (Array.isArray(sel)) {
        els = sel;
    }
    else if (exports.domIsEl(sel)) {
        els = [sel];
    }
    else {
        els = exports.domFind(sel);
        els = Array.isArray(els) ? els : [els];
    }
    var arr = [];
    if (Array.isArray(els)) {
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            if (!el) {
                continue;
            }
            if (v === undefined) {
                arr.push(getHtml(el));
            }
            else {
                setHtml(el, v);
            }
        }
    }
    return selectingOne(sel) ? arr[0] : arr;
    function getHtml(el) {
        return el.innerHTML || null;
    }
    function setHtml(el, v) {
        el.innerHTML = v;
    }
    function selectingOne(sel) {
        if (exports.domIsEl(sel)) {
            return true;
        }
        else if (typeof(sel) === 'string') {
            var parts = sel.split(/\s+/);
            return (parts && parts.length == 1 && parts[0][0] == '#');
        }
        return false;
    }
};
exports.domText = function(sel, v) {
    if (!sel) {
        throw new Error('invalidParameter');
    }
    if (v && typeof(v) !== 'string') {
        return new Error('invalidParameter');
    }
    var els = null;
    if (Array.isArray(sel)) {
        els = sel;
    }
    else if (exports.domIsEl(sel)) {
        els = [sel];
    }
    else {
        els = exports.domFind(sel);
        els = Array.isArray(els) ? els : [els];
    }
    var arr = [];
    if (Array.isArray(els)) {
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            if (!el) {
                continue;
            }
            if (v === undefined) {
                arr.push(getText(el));
            }
            else {
                setText(el, v);
            }
        }
    }
    return selectingOne(sel) ? arr[0] : arr;
    function getText(el) {
        return el.textContent || null;
    }
    function setText(el, v) {
        el.textContent = v;
    }
    function selectingOne(sel) {
        if (exports.domIsEl(sel)) {
            return true;
        }
        else if (typeof(sel) === 'string') {
            var parts = sel.split(/\s+/);
            return (parts && parts.length == 1 && parts[0][0] == '#');
        }
        return false;
    }
};
exports.domParent = function(sel) {
    if (!sel) {
        throw new Error('invalidParameter');
    }
    var els = null;
    if (Array.isArray(sel)) {
        els = sel;
    }
    else if (exports.domIsEl(sel)) {
        els = [sel];
    }
    else {
        els = exports.domFind(sel);
        els = Array.isArray(els) ? els : [els];
    }
    var arr = [];
    if (Array.isArray(els)) {
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            if (el) {
                arr.push(getParent(el));
            }
        }
    }
    return selectingOne(sel) ? arr[0] : arr;
    function getParent(el) {
        return el.parentNode || null;
    }
    function selectingOne(sel) {
        if (exports.domIsEl(sel)) {
            return true;
        }
        else if (typeof(sel) === 'string') {
            var parts = sel.split(/\s+/);
            return (parts && parts.length == 1 && parts[0][0] == '#');
        }
        return false;
    }
};
exports.domChildren = function(sel) {
    if (!sel) {
        throw new Error('invalidParameter');
    }
    var els = null;
    if (Array.isArray(sel)) {
        els = sel;
    }
    else if (exports.domIsEl(sel)) {
        els = [sel];
    }
    else {
        els = exports.domFind(sel);
        els = Array.isArray(els) ? els : [els];
    }
    var arr = [];
    if (Array.isArray(els)) {
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            if (el) {
                arr.push(getChildren(el));
            }
        }
    }
    return selectingOne(sel) ? arr[0] : arr;
    function getChildren(el) {
        var els = el.children || [];
        var arr = [];
        for (var i = 0; i < els.length; i++) {
            arr[i] = els[i];
        }
        return arr;
    }
    function selectingOne(sel) {
        if (exports.domIsEl(sel)) {
            return true;
        }
        else if (typeof(sel) === 'string') {
            var parts = sel.split(/\s+/);
            return (parts && parts.length == 1 && parts[0][0] == '#');
        }
        return false;
    }
};
exports.domSiblings = function(sel) {
    if (!sel) {
        throw new Error('invalidParameter');
    }
    var els = null;
    if (Array.isArray(sel)) {
        els = sel;
    }
    else if (exports.domIsEl(sel)) {
        els = [sel];
    }
    else {
        els = exports.domFind(sel);
        els = Array.isArray(els) ? els : [els];
    }
    var arr = [];
    if (Array.isArray(els)) {
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            if (el) {
                arr.push(getSiblings(el));
            }
        }
    }
    return selectingOne(sel) ? arr[0] : arr;
    function getSiblings(el) {
        var els = (el.parentNode && el.parentNode.children) ? el.parentNode.children : [];
        var arr = [];
        for (var i = 0; i < els.length; i++) {
            var ch = els[i];
            if (ch !== el) {
                arr.push(ch);
            }
        }
        return arr;
    }
};
exports.domPrev = function(sel) {
    if (!sel) {
        throw new Error('invalidParameter');
    }
    var els = null;
    if (Array.isArray(sel)) {
        els = sel;
    }
    else if (exports.domIsEl(sel)) {
        els = [sel];
    }
    else {
        els = exports.domFind(sel);
        els = Array.isArray(els) ? els : [els];
    }
    var arr = [];
    if (Array.isArray(els)) {
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            if (el) {
                arr.push(getPrev(el));
            }
        }
    }
    return selectingOne(sel) ? arr[0] : arr;
    function getPrev(el, psel) {
        var els = (el.parentNode && el.parentNode.children) ? el.parentNode.children : [];
        var arr = [];
        var brk = false;
        for (var i = els.length - 1; i >= 0; i--) {
            var sib = els[i];
            if (sib === el) {
                brk = true;
                continue;
            }
            if (brk && sib && (exports.domMatches(sib, psel) || !psel)) {
                return sib;
            }
            else {
                continue;
            }
        }
        return null;
    }
    function selectingOne(sel) {
        if (exports.domIsEl(sel)) {
            return true;
        }
        else if (typeof(sel) === 'string') {
            var parts = sel.split(/\s+/);
            return (parts && parts.length == 1 && parts[0][0] == '#');
        }
        return false;
    }
};
exports.domPrevAll = function(sel) {
    if (!sel) {
        throw new Error('invalidParameter');
    }
    var els = null;
    if (Array.isArray(sel)) {
        els = sel;
    }
    else if (exports.domIsEl(sel)) {
        els = [sel];
    }
    else {
        els = exports.domFind(sel);
        els = Array.isArray(els) ? els : [els];
    }
    var arr = [];
    if (Array.isArray(els)) {
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            if (el) {
                arr.push(getPrevAll(el));
            }
        }
    }
    return selectingOne(sel) ? arr[0] : arr;
    function getPrevAll(el) {
        var els = (el.parentNode && el.parentNode.children) ? el.parentNode.children : [];
        var arr = [];
        for (var i = 0; i < els.length; i++) {
            var ch = els[i];
            if (ch === el) {
                return arr;
            }
            arr.push(ch);
        }
    }
    function selectingOne(sel) {
        if (exports.domIsEl(sel)) {
            return true;
        }
        else if (typeof(sel) === 'string') {
            var parts = sel.split(/\s+/);
            return (parts && parts.length == 1 && parts[0][0] == '#');
        }
        return false;
    }
};
exports.domNext = function(sel, nsel) {
    if (!sel) {
        throw new Error('invalidParameter');
    }
    var els = null;
    if (Array.isArray(sel)) {
        els = sel;
    }
    else if (exports.domIsEl(sel)) {
        els = [sel];
    }
    else {
        els = exports.domFind(sel);
        els = Array.isArray(els) ? els : [els];
    }
    var arr = [];
    if (Array.isArray(els)) {
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            if (el) {
                arr.push(getNext(el, nsel));
            }
        }
    }
    return selectingOne(sel) ? arr[0] : arr;
    function getNext(el, nsel) {
        var els = (el.parentNode && el.parentNode.children) ? el.parentNode.children : [];
        var arr = [];
        var brk = false;
        for (var i = 0; i < els.length; i++) {
            var sib = els[i];
            if (sib === el) {
                brk = true;
                continue;
            }
            if (brk && sib && (exports.domMatches(sib, nsel) || !nsel)) {
                return sib;
            }
            else {
                continue;
            }
        }
        return null;
    }
    function selectingOne(sel) {
        if (exports.domIsEl(sel)) {
            return true;
        }
        else if (typeof(sel) === 'string') {
            var parts = sel.split(/\s+/);
            return (parts && parts.length == 1 && parts[0][0] == '#');
        }
        return false;
    }
};
exports.domNextAll = function(sel) {
    if (!sel) {
        throw new Error('invalidParameter');
    }
    var els = null;
    if (Array.isArray(sel)) {
        els = sel;
    }
    else if (exports.domIsEl(sel)) {
        els = [sel];
    }
    else {
        els = exports.domFind(sel);
        els = Array.isArray(els) ? els : [els];
    }
    var arr = [];
    if (Array.isArray(els)) {
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            if (el) {
                arr.push(getNextAll(el));
            }
        }
    }
    return selectingOne(sel) ? arr[0] : arr;
    function getNextAll(el) {
        var els = (el.parentNode && el.parentNode.children) ? el.parentNode.children : [];
        var arr = [];
        var brk = false;
        for (var i = 0; i < els.length; i++) {
            var ch = els[i];
            if (brk) {
                arr.push(ch);
            }
            if (ch === el) {
                brk = true;
            }
        }
        return arr;
    }
    function selectingOne(sel) {
        if (exports.domIsEl(sel)) {
            return true;
        }
        else if (typeof(sel) === 'string') {
            var parts = sel.split(/\s+/);
            return (parts && parts.length == 1 && parts[0][0] == '#');
        }
        return false;
    }
};
exports.domStyle = function(sel, k, v) {
    if (!sel) {
        throw new Error('invalidParameter');
    }
    if (!k || typeof(k) !== 'string') {
        throw new Error('invalidParameter');
    }
    if (v && (typeof(v) !== 'string' && isNaN(v))) {
        throw new Error('invalidParameter');
    }
    var els = null;
    if (Array.isArray(sel)) {
        els = sel;
    }
    else if (exports.domIsEl(sel)) {
        els = [sel];
    }
    else {
        els = exports.domFind(sel);
        els = Array.isArray(els) ? els : [els];
    }
    var arr = [];
    if (Array.isArray(els)) {
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            if (!el) {
                continue;
            }
            if (v === undefined) {
                arr.push(getStyle(el, k));
            }
            else {
                setStyle(el, k, v);
            }
        }
    }
    return selectingOne(sel) ? arr[0] : arr;
    function getStyle(el, k) {
        return el.style[k] || null;
    }
    function setStyle(el, k, v) {
        el.style[k] = v;
    }
    function selectingOne(sel) {
        if (exports.domIsEl(sel)) {
            return true;
        }
        else if (typeof(sel) === 'string') {
            var parts = sel.split(/\s+/);
            return (parts && parts.length == 1 && parts[0][0] == '#');
        }
        return false;
    }
};
exports.domFadeIn = function(sel, t) {
    if (!sel) {
        throw new Error('invalidParameter');
    }
    var els = null;
    if (Array.isArray(sel)) {
        els = sel;
    }
    else if (exports.domIsEl(sel)) {
        els = [sel];
    }
    else {
        els = exports.domFind(sel);
        els = Array.isArray(els) ? els : [els];
    }
    if (Array.isArray(els)) {
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            if (el) {
                fadeIn(el, t);
            }
        }
    }
    function fadeIn(el, t) {
        el.style.transition = 'opacity ' + (t && !isNaN(t) && t > 0 ? t : 250) + 'ms';
        el.style.opacity = '1';
    }
    function selectingOne(sel) {
        if (exports.domIsEl(sel)) {
            return true;
        }
        else if (typeof(sel) === 'string') {
            var parts = sel.split(/\s+/);
            return (parts && parts.length == 1 && parts[0][0] == '#');
        }
        return false;
    }
};
exports.domFadeOut = function(sel, t) {
    if (!sel) {
        throw new Error('invalidParameter');
    }
    var els = null;
    if (Array.isArray(sel)) {
        els = sel;
    }
    else if (exports.domIsEl(sel)) {
        els = [sel];
    }
    else {
        els = exports.domFind(sel);
        els = Array.isArray(els) ? els : [els];
    }
    if (Array.isArray(els)) {
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            if (el) {
                fadeOut(el, t);
            }
        }
    }
    function fadeOut(el, t) {
        el.style.transition = 'opacity ' + (t && !isNaN(t) && t > 0 ? t : 250) + 'ms';
        el.style.opacity = '0';
    }
};
exports.domFadeTo = function(sel, o, t) {
    if (!sel) {
        throw new Error('invalidParameter');
    }
    if (!o || isNaN(o) || o > 100 || o < 0) {
        throw new Error('invalidParameter');
    }
    var els = null;
    if (Array.isArray(sel)) {
        els = sel;
    }
    else if (exports.domIsEl(sel)) {
        els = [sel];
    }
    else {
        els = exports.domFind(sel);
        els = Array.isArray(els) ? els : [els];
    }
    if (Array.isArray(els)) {
        var len = els.length;
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            if (el) {
                fadeTo(el, o, t);
            }
        }
    }
    function fadeTo(el, o, t) {
        el.style.transition = 'opacity ' + (t && !isNaN(t) && t > 0 ? t : 250) + 'ms';
        el.style.opacity = o.toString();
    }
};
exports.domFadeToggle = function(sel, t) {
    if (!sel) {
        throw new Error('invalidParameter');
    }
    var els = null;
    if (Array.isArray(sel)) {
        els = sel;
    }
    else if (exports.domIsEl(sel)) {
        els = [sel];
    }
    else {
        els = exports.domFind(sel);
        els = Array.isArray(els) ? els : [els];
    }
    if (Array.isArray(els)) {
        var len = els.length;
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            if (el) {
                fadeToggle(el);
            }
        }
    }
    function fadeToggle(el) {
        el.style.transition = 'opacity ' + (t && !isNaN(t) && t > 0 ? t : 250) + 'ms';
        var s = el.ownerDocument.defaultView.getComputedStyle(el, null);
        var o = (!s) ? null : s.opacity;
        if (o === null) {
            return;
        }
        if (o === '1') {
            el.style.opacity = '0';
        }
        else {
            el.style.opacity = '1';
        }
    }
};
exports.domOn = function(sel, k, fn) {
    if (!sel) {
        throw new Error('invalidParameter');
    }
    if (!k || typeof(k) !== 'string' || typeof(fn) !== 'function') {
        return new Error('invalidParameter');
    }
    var els = null;
    if (Array.isArray(sel)) {
        els = sel;
    }
    else if (exports.domIsEl(sel)) {
        els = [sel];
    }
    else {
        els = exports.domFind(sel);
        els = Array.isArray(els) ? els : [els];
    }
    if (Array.isArray(els)) {
        var len = els.length;
        for (var i = 0; i < len; i++) {
            var el = els[i];
            if (el) {
                addListener(el, k, fn);
            }
        }
    }
    function addListener(el, k, fn) {
        var cache = exports.malloc('__DOM');
        var handler = cache('handler') || {};
        if (!handler[el]) {
            handler[el] = {};
        }
        if (!handler[el][k]) {
            handler[el][k] = []; // ONE ELEMENT CAN HAVE MULTIPLE EVENT HANDLERS
        }
        handler[el][k].push(fn);
        el.addEventListener(k, fn, false);
        cache('handler', handler);
    }
};
exports.domOff = function(sel, k) { // https://stackoverflow.com/a/4386514
    if (!sel) {
        throw new Error('invalidParameter');
    }
    if (k && typeof(k) !== 'string') {
        throw new Error('invalidParameter');
    }
    var els = null;
    if (Array.isArray(sel)) {
        els = sel;
    }
    else if (exports.domIsEl(sel)) {
        els = [sel];
    }
    else {
        els = exports.domFind(sel);
        els = Array.isArray(els) ? els : [els];
    }
    if (Array.isArray(els)) {
        var len = els.length;
        for (var i = 0; i < len; i++) {
            var el = els[i];
            if (el) {
                els[i] = removeListener(el, k || null);
            }
        }
    }
    function removeListener(el, k) {
        var cache = exports.malloc('__DOM');
        var handler = cache('handler') || {};
        var replacer = el;
        if (k) { // REMOVE BY KEY
            if (handler[el] && handler[el][k]) {
                var fns = handler[el][k];
                for (var i = 0; i < fns.length; i++) {
                    var fn = fns[i];
                    el.removeEventListener(k, fn, false);
                }
                handler[el][k] = null;
            }
        }
        else { // REMOVE ALL
            var copy = el.cloneNode(true);
            el.parentNode.replaceChild(copy, el);
            handler[el] = null;
            replacer = copy;
        }
        cache('handler', handler);
        return replacer;
    }
};
exports.domTriggerNativeEvent = function(sel, k) {
    if (!sel) {
        throw new Error('invalidParameter');
    }
    if (!k || typeof(k) !== 'string') {
        throw new Error('invalidParameter');
    }
    var els = null;
    if (Array.isArray(sel)) {
        els = sel;
    }
    else if (exports.domIsEl(sel)) {
        els = [sel];
    }
    else {
        els = exports.domFind(sel);
        els = Array.isArray(els) ? els : [els];
    }
    if (Array.isArray(els)) {
        var len = els.length;
        for (var i = 0; i < len; i++) {
            var el = els[i];
            if (el) {
                triggerEvent(el, k);
            }
        }
    }
    function triggerEvent(el, k) {
        var e = document.createEvent('HTMLEvents');
        e.initEvent(k, true, false);
        el.dispatchEvent(e);
    }
};
exports.domTriggerEvent = function(sel, k, v) {
    if (!sel) {
        throw new Error('invalidParameter');
    }
    if (!k || typeof(k) !== 'string') {
        throw new Error('invalidParameter');
    }
    var els = null;
    if (Array.isArray(sel)) {
        els = sel;
    }
    else if (exports.domIsEl(sel)) {
        els = [sel];
    }
    else {
        els = exports.domFind(sel);
        els = Array.isArray(els) ? els : [els];
    }
    if (Array.isArray(els)) {
        var len = els.length;
        for (var i = 0; i < len; i++) {
            var el = els[i];
            if (el) {
                triggerEvent(el, k, v)
            }
        }
    }
    function triggerEvent(el, k, v) {
        var e = null;
        if (window.CustomEvent) {
            e = new CustomEvent(k, {
                detail: v
            });
        } else {
            e = document.createEvent('CustomEvent');
            e.initCustomEvent(k, true, true, v);
        }
        el.dispatchEvent(e);
    }
};
exports.domAppend = function(sel, v) {
    if (!sel) {
        throw new Error('invalidParameter');
    }
    if (typeof(v) !== 'string') {
        throw new Error('invalidParameter');
    }
    var els = null;
    if (Array.isArray(sel)) {
        els = sel;
    }
    else if (exports.domIsEl(sel)) {
        els = [sel];
    }
    else {
        els = exports.domFind(sel);
        els = Array.isArray(els) ? els : [els];
    }
    if (Array.isArray(els)) {
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            if (el) {
                domAppend(el, v);
            }
        }
    }
    function domAppend(el, v) {
        el.insertAdjacentHTML('beforeend', v);
    }
};
exports.domPrepend = function(sel, v) {
    if (!sel) {
        throw new Error('invalidParameter');
    }
    if (typeof(v) !== 'string') {
        throw new Error('invalidParameter');
    }
    var els = null;
    if (Array.isArray(sel)) {
        els = sel;
    }
    else if (exports.domIsEl(sel)) {
        els = [sel];
    }
    else {
        els = exports.domFind(sel);
        els = Array.isArray(els) ? els : [els];
    }
    if (Array.isArray(els)) {
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            if (el) {
                domPrepend(el, v);
            }
        }
    }
    function domPrepend(el, v) {
        el.insertAdjacentHTML('afterbegin', v);
    }
};
exports.domRemove = function(sel) {
    if (!sel) {
        throw new Error('invalidParameter');
    }
    var els = null;
    if (Array.isArray(sel)) {
        els = sel;
    }
    else if (exports.domIsEl(sel)) {
        els = [sel];
    }
    else {
        els = exports.domFind(sel);
        els = Array.isArray(els) ? els : [els];
    }
    if (Array.isArray(els)) {
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            if (el) {
                domRemove(el);
            }
        }
    }
    function domRemove(el) {
        el.parentNode.removeChild(el);
    }
};
