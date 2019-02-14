import world from '../world';

export default function uid(len) {
    if (!Number.isInteger(len) || len <= 0) throw new Error('api-len');
    var set = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-0123456789';
    var b = set[Math.floor(Math.random() * (set.length - 12))];
    while (--len) {
        b += set[Math.floor(Math.random() * set.length)];
    }
    return b;
}
if (!world.Cor) world.Cor = {};
world.Cor.uid = uid;
