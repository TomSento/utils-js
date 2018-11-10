import $ct2ext from '../../ct2ext';

function extension(k) {
    return $ct2ext[k] || null;
}
if (window) {
    if (!window.Cor) window.Cor = {};
    window.Cor.extension = extension;
}
