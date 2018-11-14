// - remove comments
// - ensure that { or } is not inside string or inside regex;
// - does not take into account comments inside strings e.g. '', inside regex comment // is ok.
var openBracketIndexes = [];
var blindRanges = []; // strings, regular expressions
var EXP_MATCH_REGEXES = /[|&[(=]\s*(\/.+\/)/; // https://regex101.com/r/vCs702/1/

export default function minScript(str) {
    str = removeBlockComments(str);
    str = removeSingleLineComments(str);
    blindRanges = getBlindRanges();
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

function getBlindRanges() {

}
