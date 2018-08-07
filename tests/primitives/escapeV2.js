/* eslint-disable no-console */
require('../../dist/utils.node.js');

var strA = 'aa  aa';
var strB = ' aa   aa ';
var strC = '  aa    aa  ';
var strD = '   aa     aa   ';
var strE = '    aa      aa    ';

// TOTAL START NBPS
// TOTAL END NBPS
console.log('1A:' + strA.escapeV2('&nbsp;', false, '&nbsp;').replace(/\s/g, '_'));
console.log('1B:' + strB.escapeV2('&nbsp;', false, '&nbsp;').replace(/\s/g, '_'));
console.log('1C:' + strC.escapeV2('&nbsp;', false, '&nbsp;').replace(/\s/g, '_'));
console.log('1D:' + strD.escapeV2('&nbsp;', false, '&nbsp;').replace(/\s/g, '_'));
console.log('1E:' + strE.escapeV2('&nbsp;', false, '&nbsp;').replace(/\s/g, '_'));

// *a WHERE * IS BREAKING SPACE
// TOTAL END BREAKING SPACE
console.log('\n2A:' + strA.escapeV2(' ', true, ' ').replace(/\s/g, '_'));
console.log('2B:' + strB.escapeV2(' ', true, ' ').replace(/\s/g, '_'));
console.log('2C:' + strC.escapeV2(' ', true, ' ').replace(/\s/g, '_'));
console.log('2D:' + strD.escapeV2(' ', true, ' ').replace(/\s/g, '_'));
console.log('2E:' + strE.escapeV2(' ', true, ' ').replace(/\s/g, '_'));

console.log('\n3A:' + strA.escapeV2().replace(/\s/g, '_'));
console.log('3B:' + strB.escapeV2().replace(/\s/g, '_'));
console.log('3C:' + strC.escapeV2().replace(/\s/g, '_'));
console.log('3D:' + strD.escapeV2().replace(/\s/g, '_'));
console.log('3E:' + strE.escapeV2().replace(/\s/g, '_'));

console.log('\nreversed:', 'a   bcd'.reverse());
