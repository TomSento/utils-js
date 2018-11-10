export default function uid2() {
    return [Math.random().toString(36).slice(2, 8), Math.random().toString(36).slice(2, 8), Math.random().toString(36).slice(2, 8), Math.random().toString(36).slice(2, 8)].join('-');
}
if (typeof(window) === 'object') {
    if (!window.Cor) window.Cor = {};
    window.Cor.uid2 = uid2;
}
