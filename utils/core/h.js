exports.H = function(command, a, b) {
    command = command instanceof RegExp ? command.toString().slice(1, -1) : command;
    if (!command || typeof(command) !== 'string') {
        throw new Error('invalidParameter');
    }
    var data = a && b ? a : null;
    data = (data && typeof(data) === 'object') ? JSON.stringify(data) : data;
    data = data ? ('' + data) : '';
    var content = a && b ? (b || '') : (a || '');
    content = Array.isArray(content) ? content.join('') : content;
    if (typeof(content) !== 'string') {
        throw new Error('invalidParameter');
    }
    command = prepareCMD(command);
    return processCMD(command, data, content);
    function prepareCMD(cmd) {
        if (/\s{2,}/.test(cmd)) {
            throw new Error('No multiple spaces.');
        }
        if (isVarCMD(cmd)) {
            return prepareVarCMD(cmd);
        }
        else {
            return prepareGenCMD(cmd);
        }
    }
    function isVarCMD(v) {
        return v.startsWith('--');
    }
    function prepareVarCMD(cmd) {
        cmd = cmd.split(/\s*:\s*/);
        var k = cmd[0];
        var v = prepareParameterValue(cmd[1]);
        var err = validateParameterValue(v);
        if (err) {
            throw err;
        }
        return [k, v];
    }
    function prepareParameterValue(v) {
        return v;
    }
    function validateParameterValue(/* v */) {
        return null;
    }
    function prepareGenCMD(cmd) {
        var m = cmd.match(/\|/g);
        if (m && m.length > 1) {
            throw new Error('No multiple "|".');
        }
        m = cmd.match(/(\s*)\|(\s*)/);
        if (m) {
            if (m[1].length > 0 || m[2].length > 0) {
                throw new Error('No "|" surrounded with spaces.');
            }
        }
        var map = {
            'Doc': '<!DOCTYPE html><html{modifiers}>{content}</html>',
            'Head': '<head>{content}</head>',
            'Meta': '<meta{modifiers}>',
            'Title': '<title>{content}</title>',
            'Body': '<body{modifiers}>{content}</body>'
        };
        cmd = cmd.split('|');
        if (cmd[1]) {
            if (/\)(?!@|\s|$)/.test(cmd[1])) {
                throw new Error('Missing space after function\'s ")".');
            }
            if (/\)(?!@lg|@md|@sm|@xs|\s|$)/.test(cmd[1])) {
                throw new Error('Unsupported @media query.');
            }
            if (/\b[a-z]\w+\(/.test(cmd[1])) {
                throw new Error('Function must start with capital letter.');
            }
        }
        var controls = cmd[1] ? cmd[1].match(/[A-Z].*?\)(?:@lg|@md|@sm|@xs)?/g) : [];
        var template = map[cmd[0]] || null;
        if (template) {
            return [cmd[0], controls, template];
        }
        else {
            throw new Error('Invalid left-hand "' + cmd[0] + '" operator.');
        }
    }
    function processCMD(cmd, data, content) {
        var html = '';
        if (isVarCMD(cmd[0])) {
            setVar(cmd[0], cmd[1]);
        }
        else {
            if (isNonBodyCMD(cmd[0])) {
                html = inlineModifiersForNonBodyCMD(cmd);
            }
            else {
                html = inlineModifiersForInBodyCMD(cmd);
            }
            return html.replace('{content}', content);
        }
    }
    function setVar(k, v) {
        var cache = exports.malloc('__H');
        var vars = cache('vars') || {};
        if (vars[k]) {
            throw new Error('No duplicate variable.');
        }
        else {
            vars[k] = v;
            cache('vars', vars);
        }
    }
    function isNonBodyCMD(v) { // COUNT OF NOT BODY TAGS < BODY TAGS - BETTER PERFORMANCE
        return ['Doc', 'Head', 'Meta', 'Title'].indexOf(v) >= 0;
    }
    function inlineModifiersForNonBodyCMD(cmd) {
        var map = {
            'Doc': [
                ['Lang', 'lang']
            ],
            'Head': [],
            'Meta': [
                ['Charset', 'charset'],
                ['Name', 'name'],
                ['Property', 'property'],
                ['HttpEquiv', 'http-equiv'],
                ['Content', 'content']
            ],
            'Title': []
        };
        var mapPairs = map[cmd[0]];
        var controls = parseNonBodyControls(cmd[1]);
        var modifiers = '';
        var previous = -1;
        for (var i = 0, len = controls.length; i < len; i++) {
            var control = controls[i];
            var found = false;
            for (var j = 0, l = mapPairs.length; j < l; j++) {
                var pair = mapPairs[j];
                if (pair[0] === control[0]) {
                    if (j < previous) {
                        return throwRightHandFunctionOrderMismatchError(mapPairs, controls);
                    }
                    else { // FUNCTION WAS FOUND AND FUNCTIONS CHAIN IS IN SAME ORDER AS IN MAP
                        found = true;
                        modifiers += ' ' + control[0] + '="' + control[1] + '"';
                        previous = j;
                        break;
                    }
                }
            }
            if (!found) {
                throw new Error('Unsupported right-hand function "' + control[0] + '()".');
            }
        }
        return cmd[2].replace('{modifiers}', modifiers);
    }
    function throwRightHandFunctionOrderMismatchError(mapPairs, controls) {
        var msg = 'Incorrect right-hand function order, expected:';
        for (var i = 0, l = mapPairs.length; i < l; i++) {
            var pair = mapPairs[i];
            for (var j = 0, ll = controls.length; j < ll; j++) {
                var control = controls[j];
                if (control[0] === pair[0]) {
                    msg += ' ' + pair[0] + '()';
                    break;
                }
            }
        }
        throw new Error(msg + '.');
    }
    function parseNonBodyControls(arrWithControlStrings) {
        var arr = [];
        for (var i = 0; i < arrWithControlStrings.length; i++) {
            var str = arrWithControlStrings[i];
            var tmp = str.split('(');
            if (!Array.isArray(tmp) || tmp.length !== 2) {
                throw new Error('Unable to parse right-hand function "' + str + '".');
            }
            var k = tmp[0];
            if (!k) {
                throw new Error('Unable to parse right-hand function "' + str + '".');
            }
            var m = str.match(/\((.*)\)/);
            if (m) {
                var v = m[1] || '';
                arr.push([k, v]);
            }
            else {
                throw new Error('Unable to parse right-hand function "' + str + '".');
            }
        }
        return arr;
    }
    function inlineModifiersForInBodyCMD(/* cmd */) {
        return 'Not implemented yet.';
    }
    function cssReset() { // https://github.com/jgthms/minireset.css/tree/0.0.3
        var b = CSS2('html,body,p,ol,ul,li,dl,dt,dd,blockquote,figure,fieldset,legend,textarea,pre,iframe,hr,h1,h2,h3,h4,h5,h6', [
            'margin:0',
            'padding:0'
        ]);
        b += CSS2('h1,h2,h3,h4,h5,h6', [
            'font-size:100%',
            'font-weight:normal'
        ]);
        b += CSS2('ul', 'list-style:none');
        b += CSS2('button,input,select,textarea', 'margin:0');
        b += CSS2('html', 'box-sizing:border-box');
        b += CSS2('*,*:before,*:after', 'box-sizing:inherit');
        b += CSS2('img,embed,iframe,object,audio,video', [
            'height:auto',
            'max-width:100%'
        ]);
        b += CSS2('iframe', 'border:0');
        b += CSS2('table', [
            'border-collapse:collapse',
            'border-spacing:0'
        ]);
        b += CSS2('td,th', [
            'padding:0',
            'text-align:left'
        ]);
        return b;
    }
    function CSS2(k, a) {
        if (k && typeof(k) === 'string' && a) {
            if (typeof(a) === 'string') {
                if (k.indexOf('@media') >= 0) {
                    return k + '){' + a + '}';
                }
                else {
                    return k + '{' + cssPROPERTY(a) + '}';
                }
            }
            else if (Array.isArray(a)) {
                var b = '';
                for (var i = 0, l = a.length; i < l; i++) {
                    var v = a[i];
                    b += v ? cssPROPERTY(v) : '';
                }
                return b ? (k + '{' + b + '}') : '';
            }
            else {
                return '';
            }
        }
        else {
            return '';
        }
    }
    function cssPROPERTY(kv) { // AUTOPREFIXES CSS KEY-VALUE PAIR
        var autovendor = ['filter', 'appearance', 'column-count', 'column-gap', 'column-rule', 'display', 'transform', 'transform-style', 'transform-origin', 'transition', 'user-select', 'animation', 'perspective', 'animation-name', 'animation-duration', 'animation-timing-function', 'animation-delay', 'animation-iteration-count', 'animation-direction', 'animation-play-state', 'opacity', 'background', 'background-image', 'font-smoothing', 'text-size-adjust', 'backface-visibility', 'box-sizing', 'overflow-scrolling'];
        kv = kv.replace(/\s{2,}/g, ' ');
        kv = kv[kv.length - 1] === ';' ? kv.slice(0, -1) : kv;
        kv = kv.split(/\s*:\s*/);
        var k = kv[0];
        var v = kv[1];
        var sep = ':';
        var del = ';';
        if (k && v) {
            if (autovendor.indexOf(k) === -1) {
                return k + sep + v + del;
            }
            else {
                var rows = [k + sep + v];
                if (k === 'opacity') {
                    var opacity = +(v.replace(/\s/g, ''));
                    if (isNaN(opacity)) {
                        return '';
                    }
                    rows.push('filter' + sep + 'alpha(opacity=' + Math.floor(opacity * 100) + ')');
                }
                else if (k === 'font-smoothing') {
                    rows.push('-webkit-' + k + sep + v);
                    rows.push('-moz-osx-' + k + sep + v);
                }
                else if (k === 'background' || k === 'background-image') {
                    var g = '-gradient';
                    if (v.indexOf('linear' + g) >= 0 || v.indexOf('radial' + g) >= 0) {
                        rows.push('-webkit-' + k + sep + v);
                        rows.push('-moz-' + k + sep + v);
                        rows.push('-ms-' + k + sep + v);
                    }
                }
                else if (k === 'text-overflow') {
                    rows.push('-ms-' + k + sep + v);
                }
                else {
                    rows.push('-webkit-' + k + sep + v);
                    rows.push('-moz-' + k + sep + v);
                    if (k.indexOf('animation') === -1) { // SAME AS IN TOTAL.JS
                        rows.push('-ms-' + k + sep + v);
                    }
                }
                return rows.join(del) + del;
            }
        }
        else {
            return '';
        }
    }
};

// function normalizeCSSKeyframes(v) {
//     var arr = [];
//     var index = 0;
//     while (index !== -1) {
//         index = v.indexOf('@keyframes', index + 1);
//         if (index === -1) {
//             continue;
//         }
//         var counter = 0;
//         var end = -1;
//         for (var indexer = index + 10; indexer < v.length; indexer++) {
//             if (v[indexer] === '{') {
//                 counter++;
//             }
//             if (v[indexer] !== '}') {
//                 continue;
//             }
//             if (counter > 1) {
//                 counter--;
//                 continue;
//             }
//             end = indexer;
//             break;
//         }
//         if (end === -1) {
//             continue;
//         }
//         var css = v.substring(index, end + 1);
//         arr.push({
//             name: 'keyframes',
//             property: css
//         });
//     }
//     var output = [];
//     var len = arr.length;
//     for (var i = 0; i < len; i++) {
//         var name = arr[i].name;
//         var property = arr[i].property;
//         if (name !== 'keyframes') {
//             continue;
//         }
//         var plus = property.substring(1);
//         var delimiter = '\n';
//         var updated = '@' + plus + delimiter;
//         updated += '@-webkit-' + plus + delimiter;
//         updated += '@-moz-' + plus + delimiter;
//         updated += '@-o-' + plus + delimiter;
//         v = strReplace(v, property, '@[[' + output.length + ']]');
//         output.push(updated);
//     }
//     len = output.length;
//     for (var j = 0; j < len; j++) {
//         v = v.replace('@[[' + j + ']]', output[j]);
//     }
//     return v;
// }

// function strReplace(str, find, to) {
//     var beg = str.indexOf(find);
//     return beg === -1 ? str : (str.substring(0, beg) + to + str.substring(beg + find.length));
// }
