/* eslint-disable no-console */
require('../../dist/out.node.js');

var strA = 'aa  aa';
var strB = ' aa   aa ';
var strC = '  aa    aa  ';
var strD = '   aa     aa   ';
var strE = '    aa      aa    ';

// TOTAL START NBPS
// TOTAL END NBPS
console.log('1A:' + strA.escape('&nbsp;', false, '&nbsp;').replace(/\s/g, '_'));
console.log('1B:' + strB.escape('&nbsp;', false, '&nbsp;').replace(/\s/g, '_'));
console.log('1C:' + strC.escape('&nbsp;', false, '&nbsp;').replace(/\s/g, '_'));
console.log('1D:' + strD.escape('&nbsp;', false, '&nbsp;').replace(/\s/g, '_'));
console.log('1E:' + strE.escape('&nbsp;', false, '&nbsp;').replace(/\s/g, '_'));

// *a WHERE * IS BREAKING SPACE
// TOTAL END BREAKING SPACE
console.log('\n2A:' + strA.escape(' ', true, ' ').replace(/\s/g, '_'));
console.log('2B:' + strB.escape(' ', true, ' ').replace(/\s/g, '_'));
console.log('2C:' + strC.escape(' ', true, ' ').replace(/\s/g, '_'));
console.log('2D:' + strD.escape(' ', true, ' ').replace(/\s/g, '_'));
console.log('2E:' + strE.escape(' ', true, ' ').replace(/\s/g, '_'));

console.log('\n3A:' + strA.escape().replace(/\s/g, '_'));
console.log('3B:' + strB.escape().replace(/\s/g, '_'));
console.log('3C:' + strC.escape().replace(/\s/g, '_'));
console.log('3D:' + strD.escape().replace(/\s/g, '_'));
console.log('3E:' + strE.escape().replace(/\s/g, '_'));
