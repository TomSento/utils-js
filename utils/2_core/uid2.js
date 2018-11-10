export default function uid2() {
    return [Math.random().toString(36).slice(2, 8), Math.random().toString(36).slice(2, 8), Math.random().toString(36).slice(2, 8), Math.random().toString(36).slice(2, 8)].join('-');
}
if (window) {
    if (!window.Cor) window.Cor = {};
    window.Cor.uid2 = uid2;
}
