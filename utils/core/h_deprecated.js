// var REG_HTML_ATTRIBUTES_CMD_NO_MISSING_SPACE_AFTER_FUNCTION = /\)(?!\s|$)/;

// OLD - PARSING ONE COMMAND
// function HTML_ATTRIBUTES_parseOneCMD(cmd) {
//     var tmp = cmd.split('(');
//     if (!Array.isArray(tmp) || tmp.length !== 2) {
//         throw new Error('Unable to parse attribute "' + cmd + '".');
//     }
//     var k = tmp[0];
//     if (!k) {
//         throw new Error('Unable to parse attribute "' + cmd + '".');
//     }
//     var m = cmd.match(/\((.*)\)/);
//     if (m) {
//         var v = m[1] || '';
//         return composeHTMLAttribute(k, v);
//     }
//     else {
//         throw new Error('Unable to parse attribute "' + cmd + '".');
//     }
// }
// function composeHTMLAttribute(fnName, fnParam) {
//     return {
//         fnName: fnName,
//         fnParam: fnParam
//     };
// }

// SEPARATE ACSS COMMANDS: /[A-Z].*?\)(?:@lg|@md|@sm|@xs)?/g

// function validateAcssCMD(cmd) {
//     if (/\)(?!@|\s|$)/.test(cmd[1])) {
//         return new Error('Missing space after function\'s ")".');
//     }
//     if (/\)(?!@lg|@md|@sm|@xs|\s|$)/.test(cmd[1])) {
//         return new Error('Unsupported @media query.');
//     }
//     return null;
// }

// function HTML_BODYTAG_CMD_process(cmd) {
//     var m = cmd.match(/\|/g);
//     if (m && m.length > 1) {
//         throw new Error('No multiple "|".');
//     }
//     var map = {
//         'Doc': '<!DOCTYPE html><html{modifiers}>{content}</html>',
//         'Head': '<head>{content}</head>',
//         'Meta': '<meta{modifiers}>',
//         'Title': '<title>{content}</title>'
//     };
//     cmd = cmd.split('|');
//     if (cmd[1]) {
//         err = HTML_ATTRIBUTES_beforeParseValidateCMD(cmd[1]);
//         if (err) {
//             throw err;
//         }
//         var attrsCMDs = HTML_ATTRIBUTES_parseCMD(cmd[1]);
//         ATTRS_parse(cmd[1]);
//     }
//     var template = map[cmd[0]] || null;
//     if (template) {
//         return template.replace('{modifiers}', HTML_ATTRIBUTES_);
//         [cmd[0], template, attrsCMDs];
//     }
//     else {
//         throw new Error('Invalid left-hand "' + cmd[0] + '" operator.');
//     }
// }

// ORDER CHECKING
// function HTML_ATTRIBUTES_processCMD(cmd) {
//     var map = {
//         'Doc': [
//             ['Lang', 'lang']
//         ],
//         'Head': [],
//         'Meta': [
//             ['Charset', 'charset'],
//             ['Name', 'name'],
//             ['Property', 'property'],
//             ['HttpEquiv', 'http-equiv'],
//             ['Content', 'content']
//         ],
//         'Title': []
//     };
//     var mapPairs = map[cmd[0]];
//     var controls = cmd[1];
//     var modifiers = '';
//     var previous = -1;
//     for (var i = 0, len = controls.length; i < len; i++) {
//         var control = controls[i];
//         var found = false;
//         for (var j = 0, l = mapPairs.length; j < l; j++) {
//             var pair = mapPairs[j];
//             if (pair[0] === control[0]) {
//                 if (j < previous) {
//                     return throwRightHandFunctionOrderMismatchError(mapPairs, controls);
//                 }
//                 else { // FUNCTION WAS FOUND AND FUNCTIONS CHAIN IS IN SAME ORDER AS IN MAP
//                     found = true;
//                     modifiers += ' ' + control[0] + '="' + control[1] + '"';
//                     previous = j;
//                     break;
//                 }
//             }
//         }
//         if (!found) {
//             throw new Error('Unsupported right-hand function "' + control[0] + '()".');
//         }
//     }
//     return cmd[2].replace('{modifiers}', modifiers);
// }
// function throwRightHandFunctionOrderMismatchError(mapPairs, controls) {
//     var msg = 'Incorrect right-hand function order, expected:';
//     for (var i = 0, l = mapPairs.length; i < l; i++) {
//         var pair = mapPairs[i];
//         for (var j = 0, ll = controls.length; j < ll; j++) {
//             var control = controls[j];
//             if (control[0] === pair[0]) {
//                 msg += ' ' + pair[0] + '()';
//                 break;
//             }
//         }
//     }
//     throw new Error(msg + '.');
// }


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
