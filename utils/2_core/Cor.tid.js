import world from '../world';

export default function tid() {
    var d = new Date();
    return d.getFullYear() + '-'
        + ('' + (d.getMonth() + 1)).padStart(2, '0') + '-'
        + ('' + d.getDate()).padStart(2, '0') + '-'
        + ('' + d.getHours()).padStart(2, '0') + '-'
        + ('' + d.getMinutes()).padStart(2, '0');
}
if (!world.Cor) world.Cor = {};
world.Cor.tid = tid;
