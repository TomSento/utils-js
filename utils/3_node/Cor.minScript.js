// - remove comments
// - ensure that { or } is not inside string or inside regex;
// - does not take into account comments inside strings e.g. '', inside regex comment // is ok.
var EXP_MATCH_REGEX = /(\/[^\n].*?\/)[gi\n;,)\]\s]/g; // https://regex101.com/r/vCs702/12/
var EXP_MATCH_SINGLE_QUOTE_STRING = /('.*?')[\n;,)\] ]/g; // https://regex101.com/r/KjEh0t/3/
var EXP_NOTOK_SINGLE_QUOTE_STRING = /"\s*\+/; // https://regex101.com/r/I4u1hw/1/
var EXP_MATCH_DOUBLE_QUOTE_STRING = /(".*?")[\n;,)\] ]/g;
var EXP_NOTOK_DOUBLE_QUOTE_STRING = /'\s*\+/; // https://regex101.com/r/qJijm5/5/

var EXP_OBFUSCATOR_SEPARATORS = /[\s(){}[\]|=,:;!%^&*|?~/'"+-]+/g; // https://regex101.com/r/q2u8G0/4/

var SKIP;
var PROCESSED_BLOCKS = {};

export default function minScript(str) {
    SKIP = getSkipRanges(str);
    str = removeBlockComments(str);

    SKIP = null;
    SKIP = getSkipRanges(str);
    str = removeSingleLineComments(str);

    SKIP = null;
    SKIP = getSkipRanges(str);

    var brk = false;
    var i = 0;
    var j;

    str = '{' + str + '}';
    while (!brk) {
        i = findSafeIndexOf(str, '}', i);
        if (i === -1) {
            brk = true;
            continue;
        }
        j = findClosestUnprocessedOpenBracketIndex(str, i);
        if (j >= 0) {
            str = obfuscateCodeBlock(str, j, i + 1);
        }
        i++;
    }
    str = str.slice(1, str.length - 1);
    return str;
}

function getSkipRanges(str) {
    var ranges = getRegexRanges(str);
    ranges = ranges.concat(getSingleQuoteStringRanges(str));
    ranges = ranges.concat(getDoubleQuoteStringRanges(str));
    return ranges;
}

function getRegexRanges(str) {
    var m;
    var prev;
    var ranges = [];
    while (m = EXP_MATCH_REGEX.exec(str)) {
        if (Array.isArray(m) && m.length > 0) {
            if (m[1].indexOf('//') === 0 || m[1].indexOf('/*') === 0) { // ———— IS COMMENT
                prev = m[1];
                continue;
            }
            if (prev && prev.indexOf('/*') === 0 && m[1].lastIndexOf('*/') === m[1].length - 2) { // IS COMMENT
                prev = m[1];
                continue;
            }
            ranges.push(composeRange(m.index, m.index + m[1].length));
            prev = m[1];
        }
    }
    return ranges;
}

function composeRange(fromIndex, toIndex) {
    return { fromIndex: fromIndex, toIndex: toIndex };
}

function getSingleQuoteStringRanges(str) {
    var m;
    var ranges = [];
    while (m = EXP_MATCH_SINGLE_QUOTE_STRING.exec(str)) {
        if (Array.isArray(m) && m.length > 0) {
            if (EXP_NOTOK_SINGLE_QUOTE_STRING.test(str.slice(m.index, m.index + m[1].length))) {
                continue;
            }
            if (m[1].length === 2) { // ——————————————————————————————————————— EMPTY STRING
                continue;
            }
            ranges.push(composeRange(m.index, m.index + m[1].length));
        }
    }
    return ranges;
}

function getDoubleQuoteStringRanges(str) {
    var m;
    var ranges = [];
    while (m = EXP_MATCH_DOUBLE_QUOTE_STRING.exec(str)) {
        if (Array.isArray(m) && m.length > 0) {
            if (EXP_NOTOK_DOUBLE_QUOTE_STRING.test(str.slice(m.index, m.index + m[1].length))) {
                continue;
            }
            if (m[1].length === 2) { // ——————————————————————————————————————— EMPTY STRING
                continue;
            }
            ranges.push(composeRange(m.index, m.index + m[1].length));
        }
    }
    return ranges;
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
        var range = findSkipRange(i);
        if (range) {
            b += str.slice(j, i + 2);
            j = i + 2;
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

function findSkipRange(i) {
    return SKIP.find(function(range) {
        return (range.fromIndex <= i && i < range.toIndex);
    });
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
        var range = findSkipRange(i);
        if (range) {
            b += str.slice(j, i + 2);
            j = i + 2;
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

function findSafeIndexOf(str, ch, fromIndex) {
    var i = fromIndex;
    var brk = false;
    while (!brk) {
        i = str.indexOf(ch, i);
        if (i === -1) {
            brk = true;
            continue;
        }
        var range = findSkipRange(i);
        if (range) {
            i = range.toIndex;
            continue;
        }
        brk = true;
    }
    return i;
}

function findClosestUnprocessedOpenBracketIndex(str, fromIndex) { // —————————— DO NOT DUPLICATE BLOCKS OF NESTED FUNCTIONS
    var i = fromIndex;
    var brk = false;
    while (!brk) {
        i = findSafeLastIndexOf(str, '{', i - 1);
        if (i === -1) {
            brk = true;
            continue;
        }
        if (!PROCESSED_BLOCKS[i]) {
            PROCESSED_BLOCKS[i] = true;
            brk = true;
            continue;
        }
    }
    return i;
}

function findSafeLastIndexOf(str, ch, fromIndex) {
    var i = fromIndex;
    var brk = false;
    while (!brk) {
        i = str.lastIndexOf(ch, i);
        if (i === -1) {
            brk = true;
            continue;
        }
        var range = findSkipRange(i);
        if (range) {
            i = range.fromIndex;
            continue;
        }
        brk = true;
    }
    return i;
}

function obfuscateCodeBlock(str, blockStartIdx, blockEndIdx) {
    var chunks = getBlockChunks(str, blockStartIdx, blockEndIdx);
    str = BLOCK_obfuscateFunctions(str, blockStartIdx, blockEndIdx, chunks);
    return str;
}

function BLOCK_obfuscateFunctions(str, blockStartIdx, blockEndIdx, chunks) {
    if (blockStartIdx === 0) {
        var block = str.slice(blockStartIdx, blockEndIdx);
        SKIP = null;
        SKIP = getSkipRanges(block);

        var i = chunks.length;
        var chunk;
        var fnDeclarations = {};
        while (i > 3) {
            i--;
            if (chunks[i][0].trim()[0] === '(' && chunks[i - 2][0] === ' ' && chunks[i - 3][0].trim() === 'function') {
                chunk = chunks[i - 1];
                var skip = findSkipRange(chunk.index);
                if (skip) {
                    continue;
                }
                fnDeclarations[chunk[0]] = chunk;
            }
        }

        i = chunks.length;
        var fnCalls = [];
        while (i > 1) {
            i--;
            chunk = chunks[i - 1];
            if (chunks[i][0].trim()[0] === '(' && fnDeclarations[chunk[0]]) {
                if (chunk.index === fnDeclarations[chunk[0]].index) { // —————— SKIP DECLARATIONS
                    continue;
                }
                fnCalls.push(chunk);
            }
        }
    }
    return str;
}

function getBlockChunks(str, blockStartIdx, blockEndIdx) {
    var m;
    var block = str.slice(blockStartIdx, blockEndIdx);
    var i = 0;
    var arr = [];
    while (m = EXP_OBFUSCATOR_SEPARATORS.exec(block)) {
        if (Array.isArray(m) && m.length > 0) {
            arr.push(composeMatch(block.slice(i, m.index), i));
            arr.push(composeMatch(m[0], m.index));
            i = m.index + m[0].length;
        }
    }
    return arr;
}

function composeMatch(string, index) {
    return {
        0: string,
        index: index
    };
}
