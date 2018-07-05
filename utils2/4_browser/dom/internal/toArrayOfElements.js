import $domIsEl from '../domIsEl';
import $domFind from '../domFind';

export default function $toArrayOfElements(sel) {
    if (Array.isArray(sel)) {
        return sel;
    }
    else if ($domIsEl(sel)) {
        return [sel];
    }
    else {
        var els = $domFind(sel);
        return Array.isArray(els) ? els : [els];
    }
}
