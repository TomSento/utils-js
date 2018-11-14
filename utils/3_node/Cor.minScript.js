// - remove comments
// - ensure that { or } is not inside string or inside regex;
var openBracketIndexes = [];
var blindRanges = []; // strings, regular expressions
var EXP_MATCH_REGEXES = /[|&[(=]\s*(\/.+\/)/; // https://regex101.com/r/vCs702/1/

export default function minScript(str) {
    blindRanges = getBlindRanges();
    return str;
}

function removeBlockComments(str) {
    var searchStart = '/**';
    var searchEnd = '*/';
    var i;
    var j;
    while (i !== -1) {
        i = str.indexOf(searchStart, j);
        if (i === -1) {
            continue;
        }
        j = str.indexOf(searchEnd, j + 2); // ————————————————————————————————— + 2 BECAUSE /**/ IS ALLOWED
        j += 2;
    }
}

function getBlindRanges() {

}
