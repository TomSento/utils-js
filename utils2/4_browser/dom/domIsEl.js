export default function $domIsEl(el) {
    return (el instanceof Node || el instanceof Element || el instanceof HTMLDocument);
}
window.$domIsEl = $domIsEl;
