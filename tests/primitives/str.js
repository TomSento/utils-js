require('../../dist/utils.all.js');

var strA = 'aa  aa';
var strB = ' aa   aa ';
var strC = '  aa    aa  ';
var strD = '   aa     aa   ';
var strE = '    aa      aa    ';

// TOTAL START NBPS
// TOTAL END NBPS
$log('1A:' + $strToHTMLText(strA, true, false, true, true).replace(/\s/g, '_'));
$log('1B:' + $strToHTMLText(strB, true, false, true, true).replace(/\s/g, '_'));
$log('1C:' + $strToHTMLText(strC, true, false, true, true).replace(/\s/g, '_'));
$log('1D:' + $strToHTMLText(strD, true, false, true, true).replace(/\s/g, '_'));
$log('1E:' + $strToHTMLText(strE, true, false, true, true).replace(/\s/g, '_'));

// *a WHERE * IS BREAKING SPACE
// TOTAL END BREAKING SPACE
$log('2A:' + $strToHTMLText(strA, false, true, false, true).replace(/\s/g, '_'));
$log('2B:' + $strToHTMLText(strB, false, true, false, true).replace(/\s/g, '_'));
$log('2C:' + $strToHTMLText(strC, false, true, false, true).replace(/\s/g, '_'));
$log('2D:' + $strToHTMLText(strD, false, true, false, true).replace(/\s/g, '_'));
$log('2E:' + $strToHTMLText(strE, false, true, false, true).replace(/\s/g, '_'));

// ETC...

var reversed = $strReverse('a   bcd');
$log('reversed:' + reversed);
var until = $strUntil(reversed, /\s+/g);
$log('until:' + until);
