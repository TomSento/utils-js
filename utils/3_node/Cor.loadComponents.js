function loadComponents(obj) {
    var result = { component: {}, header: {}, footer: {} };

    var k;
    var v;
    var i;
    var l;

    var cwd = process.cwd();
    var node_component = {};
    var page_key;
    var page = {};


    for (k in obj) {
        node_component[k] = require(`${cwd}/components/${k}/${k}.node`);
        result.component[k] = node_component[k].render;
        v = obj[k];
        if (v && Array.isArray(v.pages)) {
            i = v.pages.length;
            while (i--) {
                page_key = v.pages[i];
                if (!page[page_key]) {
                    page[page_key] = { header: '', footer: '' };
                }
                if (node_component[k].header) page[page_key].header += node_component[k].header;
                if (node_component[k].footer) page[page_key].footer += node_component[k].footer;
            }
        }
    }

    var unique;
    var builder;

    var lines;
    var line;

    var path_src_look = ' src="';
    var path_href_look = ' href="';
    var path_start_look;
    var path_start;

    var path_end_look = '"';
    var path_end;
    var path;

    for (k in page) {
        unique = {};

        builder = '';
        lines = page[k].header.split('\n');
        for (i = 0, l = lines.length; i < l; i++) {
            line = lines[i].trim();
            if (!line) continue;

            path_start_look = line[0] === '<' && line[1] === 's' ? path_src_look : path_href_look;

            path_start = line.indexOf(path_start_look, 5); // <link
            if (path_start === -1) continue;

            path_end = line.indexOf(path_end_look, path_start + path_start_look.length);
            if (path_end === -1) continue;

            path = line.slice(path_start + path_start_look.length, path_end);

            if (unique[path]) continue;
            unique[path] = true;
            builder += '\n' + line;
        }
        result.header[k] = builder;


        builder = '';
        lines = page[k].footer.split('\n');
        for (i = 0, l = lines.length; i < l; i++) {
            line = lines[i].trim();
            if (!line) continue;

            path_start = line.indexOf(path_src_look, 7);
            if (path_start === -1) continue;

            path_end = line.indexOf(path_end_look, path_start + path_src_look.length);
            if (path_end === -1) continue;

            path = line.slice(path_start + path_src_look.length, path_end);

            if (unique[path]) continue;
            unique[path] = true;
            builder += '\n' + line;
        }
        result.footer[k] = builder;
        builder = undefined;


        return result;
    }
}

if (!global.Cor) global.Cor = {};
global.Cor.loadComponents = loadComponents;
