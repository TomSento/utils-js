var U = require('../dist/utils.git');

var strA = 'aa  aa';
var strB = ' aa   aa ';
var strC = '  aa    aa  ';
var strD = '   aa     aa   ';
var strE = '    aa      aa    ';

// TOTAL START NBPS
// TOTAL END NBPS
U.log('1A:' + U.strToHTMLText(strA, true, false, true, true).replace(/\s/g, '_'));
U.log('1B:' + U.strToHTMLText(strB, true, false, true, true).replace(/\s/g, '_'));
U.log('1C:' + U.strToHTMLText(strC, true, false, true, true).replace(/\s/g, '_'));
U.log('1D:' + U.strToHTMLText(strD, true, false, true, true).replace(/\s/g, '_'));
U.log('1E:' + U.strToHTMLText(strE, true, false, true, true).replace(/\s/g, '_'));

// *a WHERE * IS BREAKING SPACE
// TOTAL END BREAKING SPACE
U.log('2A:' + U.strToHTMLText(strA, false, true, false, true).replace(/\s/g, '_'));
U.log('2B:' + U.strToHTMLText(strB, false, true, false, true).replace(/\s/g, '_'));
U.log('2C:' + U.strToHTMLText(strC, false, true, false, true).replace(/\s/g, '_'));
U.log('2D:' + U.strToHTMLText(strD, false, true, false, true).replace(/\s/g, '_'));
U.log('2E:' + U.strToHTMLText(strE, false, true, false, true).replace(/\s/g, '_'));

// ETC...

var reversed = U.strReverse('a   bcd');
U.log('reversed:' + reversed);
var until = U.strUntil(reversed, /\s+/g);
U.log('until:' + until);
