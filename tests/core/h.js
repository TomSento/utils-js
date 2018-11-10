var h = require('../../dist/out.node.js').h;

var i = 50000;
var t = Date.now();
while (i) {
    h('Button|BdA() Bdc(#1B1F23.2) Bdc(#1B1F23.35):h Bdrad(4px 0 0 4px) Bgc(#EFF3F6) Bgi(linear-gradient[-180deg, #FAFBFC 0%, #EFF3F6 90%]) Bgi(linear-gradient[-180deg, #F0F3F6 0%, #E6EBF1 90%]):h C(#24292E) Cur(p) Fw(600) Fz(14px) Lh(20px) Pos(r) Px(12px) Py(6px) Va(m)', 'test button');
    i--;
}
console.log((Date.now() - t) + 'ms'); // eslint-disable-line no-console
