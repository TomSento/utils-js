HTMLCollection.from = function(str) { // -------------------------------------> https://github.com/nefe/You-Dont-Need-jQuery#6.4
    var context = document.implementation.createHTMLDocument();

    // Set the base href for the created document so any parsed elements with URLs
    // are based on the document's URL
    var base = context.createElement('base');
    base.href = document.location.href;
    context.head.appendChild(base);

    context.body.innerHTML = str;
    return context.body.children;
};
