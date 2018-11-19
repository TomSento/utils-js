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
var BLOCK_START_IDX;
var BLOCK_END_IDX;
var OBFUSCATED = {};

export default function minScript(str) {
    SKIP = getSkipRanges(str);
    str = removeBlockComments(str);

    SKIP = null;
    SKIP = getSkipRanges(str);
    str = removeSingleLineComments(str);

    str = '{' + str + '}';
    SKIP = null;
    SKIP = getSkipRanges(str);

    var brk = false;
    var i = 0;
    var j;
    var block;
    var l;

    while (!brk) {
        i = findSafeIndexOf(str, '}', i);
        if (i === -1) {
            brk = true;
            continue;
        }
        j = findClosestUnprocessedOpenBracketIndex(str, i);
        if (j >= 0) {
            block = str.slice(j, i + 1);
            BLOCK_START_IDX = j;
            BLOCK_END_IDX = i + 1;
            l = block.length;
            block = getObfuscatedBlock(block);
            str = str.slice(0, j) + block + str.slice(i + 1);
            i += (block.length - l);
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
        var range = findSkipRange(SKIP, i);
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

function findSkipRange(ranges, index) {
    var range;
    for (var i = 0, l = ranges.length; i < l; i++) {
        range = ranges[i];
        if (range.fromIndex <= index && index < range.toIndex) {
            return range;
        }
    }
    return null;
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
        var range = findSkipRange(SKIP, i);
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
        var range = findSkipRange(SKIP, i);
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
        var range = findSkipRange(SKIP, i);
        if (range) {
            i = range.fromIndex;
            continue;
        }
        brk = true;
    }
    return i;
}

function getObfuscatedBlock(block) {
    var oldBlock = block;
    var chunks = getBlockChunks(block);
    block = BLOCK_obfuscateFunctions(block, chunks);
    updateProcessedBlocks(block);
    updateSkipRanges(oldBlock, block);
    return block;
}

function getBlockChunks(block) {
    var m;
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

function BLOCK_obfuscateFunctions(block, chunks) {
    var blockSkip = getSkipRanges(block);

    var i = chunks.length;
    var chunk;
    var skip;
    var fnDeclarations = {};
    while (i > 3) {
        i--;
        if (chunks[i][0].trim()[0] === '(' && chunks[i - 2][0] === ' ' && chunks[i - 3][0].trim() === 'function') {
            chunk = chunks[i - 1];
            if (OBFUSCATED[chunk[0]]) {
                continue;
            }
            skip = findSkipRange(blockSkip, chunk.index);
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
            skip = findSkipRange(blockSkip, chunk.index);
            if (skip) {
                continue;
            }
            fnCalls.push(chunk);
        }
    }
    return BLOCK_replaceFunctionNames(block, fnDeclarations, fnCalls);
}

function BLOCK_replaceFunctionNames(block, fnDeclarations, fnCalls) {
    for (var k in fnDeclarations) {
        if (fnDeclarations.hasOwnProperty(k)) {
            var hash = getHash();
            OBFUSCATED[hash] = true;
            block = block.slice(0, fnDeclarations[k].index) + hash + block.slice(fnDeclarations[k].index + fnDeclarations[k][0].length);
        }
    }
    return block;
}

function getHash() {
    var l = 6;
    var set = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var b = set[Math.floor(Math.random() * (set.length - 10))];
    while (l--) {
        b += set[Math.floor(Math.random() * set.length)];
    }
    return b;
}

function updateProcessedBlocks(newBlock) {
    for (var k in PROCESSED_BLOCKS) {
        if (PROCESSED_BLOCKS.hasOwnProperty(k)) {
            if (k > BLOCK_START_IDX && k < BLOCK_END_IDX) {
                PROCESSED_BLOCKS[k] = false;
            }
        }
    }

    var i = 0;
    while (i !== -1) {
        i++;
        i = newBlock.indexOf('{', i);
        if (i === -1) {
            continue;
        }
        PROCESSED_BLOCKS[BLOCK_START_IDX + i] = true;
    }
}

function updateSkipRanges(oldBlock, newBlock) {
    var l = SKIP.length;
    var range;
    var tmp = [];
    while (l--) {
        range = SKIP[l];
        if (range.toIndex <= BLOCK_START_IDX || range.fromIndex >= BLOCK_END_IDX) {
            tmp.push(range);
        }
    }
    SKIP = tmp;

    l = SKIP.length;
    var len;
    while (l--) {
        range = SKIP[l];
        if (range.fromIndex >= BLOCK_END_IDX) {
            len = newBlock.length - oldBlock.length;
            range.fromIndex += len;
            range.toIndex += len;
        }
    }

    var ranges = getSkipRanges(newBlock);
    l = ranges.length;
    while (l--) {
        range = ranges[l];
        range.fromIndex += BLOCK_START_IDX;
        range.toIndex += BLOCK_START_IDX;
        SKIP.push(range);
    }
}
