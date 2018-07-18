export default function parseMultipartHeader(header) {
    var tmp = '';
    var search = ' name="';
    var len = search.length;
    var beg = header.indexOf(search);
    if (beg >= 0) {
        tmp = header.slice(beg + len, header.indexOf('"', beg + len));
    }
    var name = tmp ? tmp : ('undefined_' + Math.floor(Math.random() * 100000)); // HTML INPUT NAME
    tmp = '';
    search = ' filename="';
    len = search.length;
    beg = header.indexOf(search);
    if (beg >= 0) {
        tmp = header.slice(beg + len, header.indexOf('"', beg + len));
    }
    return {
        name: name,
        filename: tmp || null
    };
}
