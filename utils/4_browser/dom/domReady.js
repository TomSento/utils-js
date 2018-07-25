export default function $domReady(fn) {
    if (!fn || typeof(fn) !== 'function') {
        throw new Error('api-fn');
    }
    if (document.attachEvent ? (document.readyState === 'complete') : (document.readyState !== 'loading')) {
        fn();
    }
    else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}
window.$domReady = $domReady;
