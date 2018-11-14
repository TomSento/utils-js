// - remove comments
// - ensure that { or } is not inside string or inside regex;
var openBracketIndexes = [];
var blindRanges = []; // strings, regular expressions
var EXP_MATCH_REGEXES = /[|&[(=]\s*(\/.+\/)/; // https://regex101.com/r/vCs702/1/

export default function minScript(str) {
    blindRanges = getBlindRanges();
    return str;
}

function getBlindRanges() {

}
