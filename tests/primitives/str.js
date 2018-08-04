/* eslint-disable no-console */
require('../../dist/utils.node.js');

var strA = 'aa  aa';
var strB = ' aa   aa ';
var strC = '  aa    aa  ';
var strD = '   aa     aa   ';
var strE = '    aa      aa    ';

// TOTAL START NBPS
// TOTAL END NBPS
console.log('1A:' + strA.$escape(true, false, true, true).replace(/\s/g, '_'));
console.log('1B:' + strB.$escape(true, false, true, true).replace(/\s/g, '_'));
console.log('1C:' + strC.$escape(true, false, true, true).replace(/\s/g, '_'));
console.log('1D:' + strD.$escape(true, false, true, true).replace(/\s/g, '_'));
console.log('1E:' + strE.$escape(true, false, true, true).replace(/\s/g, '_'));

// *a WHERE * IS BREAKING SPACE
// TOTAL END BREAKING SPACE
console.log('2A:' + strA.$escape(false, true, false, true).replace(/\s/g, '_'));
console.log('2B:' + strB.$escape(false, true, false, true).replace(/\s/g, '_'));
console.log('2C:' + strC.$escape(false, true, false, true).replace(/\s/g, '_'));
console.log('2D:' + strD.$escape(false, true, false, true).replace(/\s/g, '_'));
console.log('2E:' + strE.$escape(false, true, false, true).replace(/\s/g, '_'));

// ETC...

var reversed = 'a   bcd'.$reverse();
console.log('reversed:' + reversed);
