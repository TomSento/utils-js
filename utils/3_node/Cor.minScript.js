// - remove comments
// - ensure that { or } is not inside string or inside regex;
// - does not take into account comments inside strings e.g. '', inside regex comment // is ok.
var openBracketIndexes = [];
var blindRanges = []; // strings, regular expressions
var EXP_MATCH_REGEX = /(\/.+\/)[gi\n;,) ]/g; // https://regex101.com/r/vCs702/6/
var EXP_MATCH_STRINGS = /('.*?')[\n;,) ]/g; // https://regex101.com/r/KjEh0t/2/

export default function minScript(str) {
    str = removeBlockComments(str);
    str = removeSingleLineComments(str);
    blindRanges = getBlindRanges(str);
    return str;
}

function removeBlockComments(str) {
    var i;
    var searchStart = '/*';
    var j = 0;
    var b = '';
    var searchEnd = '*/';
    while (i !== -1) {
        i = str.indexOf(searchStart, j);
        if (i === -1) {
            b += str.slice(j);
            continue;
        }
        b += str.slice(j, i);
        j = str.indexOf(searchEnd, i + 2); // ————————————————————————————————— + 2 BECAUSE /**/ IS ALLOWED
        if (j === -1) {
            i = -1;
            continue;
        }
        j += 2;
    }
    return b;
}

function removeSingleLineComments(str) {
    var i;
    var searchStart = '//';
    var j = 0;
    var b = '';
    var searchEnd = '\n';
    while (i !== -1) {
        i = str.indexOf(searchStart, j);
        if (i === -1) {
            b += str.slice(j);
            continue;
        }
        b += str.slice(j, i);
        j = str.indexOf(searchEnd, i + 2);
        if (j === -1) {
            i = -1;
            continue;
        }
    }
    return b;
}

function getBlindRanges(str) {
    var ranges = getRegexRanges(str);
    ranges = ranges.concat(getStringRanges(str));
    return ranges;
}

function getRegexRanges(str) {
    var m;
    var ranges = [];
    while (m = EXP_MATCH_REGEX.exec(str)) {
        if (Array.isArray(m) && m.length > 0) {
            ranges.push(composeRange(m.index, m.index + m[1].length));
        }
    }
    return ranges;
}

function composeRange(fromIndex, toIndex) {
    return { fromIndex: fromIndex, toIndex: toIndex };
}

function getStringRanges() {
    var m;
    var ranges = [];
}
