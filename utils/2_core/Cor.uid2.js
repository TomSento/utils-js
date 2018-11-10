import world from '../world';

export default function uid2() {
    return [Math.random().toString(36).slice(2, 8), Math.random().toString(36).slice(2, 8), Math.random().toString(36).slice(2, 8), Math.random().toString(36).slice(2, 8)].join('-');
}
if (!world.Cor) world.Cor = {};
world.Cor.uid2 = uid2;
