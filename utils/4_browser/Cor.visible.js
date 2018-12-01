if (!window.Cor) window.Cor = {};

window.Cor.visible = function(el) { // ———————————————————————————————————————— https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
};
