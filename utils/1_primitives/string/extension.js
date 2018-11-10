import $ct2ext from '../../ct2ext';

export default function extension(k) {
    return $ct2ext[k] || null;
}
if (typeof(window) === 'object') {
    if (!window.Cor) window.Cor = {};
    window.Cor.extension = extension;
}
