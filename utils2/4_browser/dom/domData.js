/* eslint-disable no-underscore-dangle */
import $domIsEl from './domIsEl';
import $domFind from './domFind';

export default function $domData(sel, k, v) { // NO ACTION FOR "document"
    if (!sel) {
        throw new Error('api-sel');
    }
    if (!k || typeof(k) !== 'string') {
        throw new Error('api-k');
    }
    var els = null;
    if (Array.isArray(sel)) {
        els = sel;
    }
    else if ($domIsEl(sel)) {
        els = [sel];
    }
    else {
        els = $domFind(sel);
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
    if (v === undefined) {
        return selectingOne(sel) ? arr[0] : arr;
    }
    function getData(el, k) {
        if (el.__elementData && el.__elementData[k]) {
            return el.__elementData[k];
        }
        if (el.dataset) {
            return el.dataset[k];
        }
        return null; // "document" DOES NOT HAVE "dataset"
    }
    function setData(el, k, v) {
        if (el.dataset) {
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
    }
    function selectingOne(sel) {
        if ($domIsEl(sel)) {
            return true;
        }
        else if (typeof(sel) === 'string') {
            var parts = sel.split(/\s+/);
            return (parts && parts.length == 1 && parts[0][0] == '#');
        }
        return false;
    }
}
window.$domData = $domData;
