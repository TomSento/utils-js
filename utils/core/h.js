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
    if (!command[2]) {
        throw new Error('Invalid left-hand "' + command[0] + '" operator.');
    }
    return processCMD(command, data, content);
    function prepareCMD(cmd) {
        var map = {
            'Doc': '<!DOCTYPE html><html{modifiers}>{content}</html>',
            'Head': '<head>{content}</head>',
            'Meta': '<meta{modifiers}>',
            'Title': '<title>{content}</title>',
            'Body': '<body{modifiers}>{content}</body>'
        };
        cmd = cmd.split('|');
        var controls = cmd[1] ? cmd[1].match(/[A-Z].*?\)(?:@lg|@md|@sm|@xs)?/g) : [];
        var template = map[cmd[0]] || null;
        return [cmd[0], controls, template];
    }
    function processCMD(cmd, data, content) {
        var html = '';
        if (isNonBodyCMD(cmd[0])) {
            html = inlineModifiersForNonBodyCMD(cmd);
        }
        else {
            html = inlineModifiersForInBodyCMD(cmd);
        }
        return html.replace('{content}', content);
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
    function throwRightHandFunctionOrderMismatchError(/* mapPairs, controls */) {
        var msg = 'Wrong right-hand function order, expected order: ';
        throw new Error(msg);
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
};
