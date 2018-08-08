(function(nativeRemoveChild) {
    Element.prototype.removeChild = function(el) {
        if (el.previousElementSibling instanceof HTMLStyleElement) { // ------> REMOVE ACSS STYLES
            nativeRemoveChild.call(this, el.previousElementSibling);
        }
        return nativeRemoveChild.call(this, el);
    };
}(Element.prototype.removeChild));
