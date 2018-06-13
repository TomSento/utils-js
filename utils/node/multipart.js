
/* eslint-disable no-fallthrough, no-bitwise */
function MultipartParser() { // ----------------------------------------------> https://github.com/felixge/node-formidable/blob/v1.2.1/lib/multipart_parser.js
    this.boundary = null;
    this.boundaryChars = null;
    this.lookbehind = null;
    this.index = null;
    this.flags = 0;
    this.STATE = {
        PARSER_UNINITIALIZED: 0,
        START: 1,
        START_BOUNDARY: 2,
        HEADER_FIELD_START: 3,
        HEADER_FIELD: 4,
        HEADER_VALUE_START: 5,
        HEADER_VALUE: 6,
        HEADER_VALUE_ALMOST_DONE: 7,
        HEADERS_ALMOST_DONE: 8,
        PART_DATA_START: 9,
        PART_DATA: 10,
        PART_END: 11,
        END: 12
    };
    this.state = this.STATE.PARSER_UNINITIALIZED;
    this.stateToString = function(stateNumber) {
        for (var k in this.STATE) {
            if (this.STATE.hasOwnProperty(k)) {
                var number = this.STATE[k];
                if (number === stateNumber) {
                    return k;
                }
            }
        }
    };
    this.F = {
        PART_BOUNDARY: 1,
        LAST_BOUNDARY: 2
    };
}
MultipartParser.prototype = {
    initWithBoundary: function(str) {
        var Buffer = require('buffer').Buffer;
        this.boundary = Buffer.alloc(str.length + 4);
        this.boundary.write('\r\n--', 0);
        this.boundary.write(str, 4);
        this.lookbehind = Buffer.alloc(this.boundary.length + 8);
        this.state = this.STATE.START;
        this.boundaryChars = {};
        for (var i = 0; i < this.boundary.length; i++) {
            this.boundaryChars[this.boundary[i]] = true;
        }
    },
    write: function(buffer) {
        var self = this;
        var i = 0;
        var len = buffer.length;
        var prevIndex = this.index;
        var index = this.index;
        var state = this.state;
        var flags = this.flags;
        var lookbehind = this.lookbehind;
        var boundary = this.boundary;
        var boundaryChars = this.boundaryChars;
        var boundaryLength = this.boundary.length;
        var boundaryEnd = boundaryLength - 1;
        var bufferLength = buffer.length;
        var c;
        var cl;
        function mark(name) {
            self[name + 'Mark'] = i;
        }
        function clear(name) {
            delete self[name + 'Mark'];
        }
        function dataCallback(name, clear) {
            var markSymbol = name + 'Mark';
            if (!self.hasOwnProperty(markSymbol)) {
                return;
            }
            if (!clear) {
                callback(name, buffer, self[markSymbol], buffer.length);
                self[markSymbol] = 0;
            }
            else {
                callback(name, buffer, self[markSymbol], i);
                delete self[markSymbol];
            }
        }
        function callback(name, buffer, start, end) {
            if (start !== undefined && start === end) {
                return;
            }
            var callbackSymbol = 'on' + name.substr(0, 1).toUpperCase() + name.substr(1);
            var fn = self[callbackSymbol];
            return fn && fn(buffer, start, end);
        }
        function lower(c) {
            return c | 0x20;
        }
        var LF = 10;
        var CR = 13;
        var SPACE = 32;
        var HYPHEN = 45;
        var COLON = 58;
        var A = 97;
        var Z = 122;
        for (i = 0; i < len; i++) {
            c = buffer[i];
            switch (state) {
                case this.STATE.PARSER_UNINITIALIZED:
                    return i;
                case this.STATE.START:
                    index = 0;
                    state = this.STATE.START_BOUNDARY;
                case this.STATE.START_BOUNDARY:
                    if (index == boundary.length - 2) {
                        if (c == HYPHEN) {
                            flags |= this.F.LAST_BOUNDARY;
                        }
                        else if (c != CR) {
                            return i;
                        }
                        index++;
                        break;
                    }
                    else if (index - 1 == boundary.length - 2) {
                        if (flags & this.F.LAST_BOUNDARY && c == HYPHEN) {
                            callback('end');
                            state = this.STATE.END;
                            flags = 0;
                        }
                        else if (!(flags & this.F.LAST_BOUNDARY) && c == LF) {
                            index = 0;
                            callback('partBegin');
                            state = this.STATE.HEADER_FIELD_START;
                        }
                        else {
                            return i;
                        }
                        break;
                    }
                    if (c != boundary[index + 2]) {
                        index = -2;
                    }
                    if (c == boundary[index + 2]) {
                        index++;
                    }
                    break;
                case this.STATE.HEADER_FIELD_START:
                    state = this.STATE.HEADER_FIELD;
                    mark('headerField');
                    index = 0;
                case this.STATE.HEADER_FIELD:
                    if (c == CR) {
                        clear('headerField');
                        state = this.STATE.HEADERS_ALMOST_DONE;
                        break;
                    }
                    index++;
                    if (c == HYPHEN) {
                        break;
                    }
                    if (c == COLON) {
                        if (index == 1) {
                            return i; // -------------------------------------> EMPTY HEADER FIELD
                        }
                        dataCallback('headerField', true);
                        state = this.STATE.HEADER_VALUE_START;
                        break;
                    }
                    cl = lower(c);
                    if (cl < A || cl > Z) {
                        return i;
                    }
                    break;
                case this.STATE.HEADER_VALUE_START:
                    if (c == SPACE) {
                        break;
                    }
                    mark('headerValue');
                    state = this.STATE.HEADER_VALUE;
                case this.STATE.HEADER_VALUE:
                    if (c == CR) {
                        dataCallback('headerValue', true);
                        callback('headerEnd');
                        state = this.STATE.HEADER_VALUE_ALMOST_DONE;
                    }
                    break;
                case this.STATE.HEADER_VALUE_ALMOST_DONE:
                    if (c != LF) {
                        return i;
                    }
                    state = this.STATE.HEADER_FIELD_START;
                    break;
                case this.STATE.HEADERS_ALMOST_DONE:
                    if (c != LF) {
                        return i;
                    }
                    callback('headersEnd');
                    state = this.STATE.PART_DATA_START;
                    break;
                case this.STATE.PART_DATA_START:
                    state = this.STATE.PART_DATA;
                    mark('partData');
                case this.STATE.PART_DATA:
                    prevIndex = index;
                    if (index === 0) {
                        i += boundaryEnd;
                        while (i < bufferLength && !boundaryChars.hasOwnProperty(buffer[i])) { // BOYER-MOORE DERRIVED ALGORITHM TO SAFELY SKIP NON-BOUNDARY DATA
                            i += boundaryLength;
                        }
                        i -= boundaryEnd;
                        c = buffer[i];
                    }
                    if (index < boundary.length) {
                        if (boundary[index] == c) {
                            if (index === 0) {
                                dataCallback('partData', true);
                            }
                            index++;
                        }
                        else {
                            index = 0;
                        }
                    }
                    else if (index == boundary.length) {
                        index++;
                        if (c == CR) {
                            flags |= this.F.PART_BOUNDARY; // ----------------> CR = part boundary
                        }
                        else if (c == HYPHEN) {
                            flags |= this.F.LAST_BOUNDARY; // ----------------> HYPHEN = end boundary
                        }
                        else {
                            index = 0;
                        }
                    }
                    else if (index - 1 == boundary.length) {
                        if (flags & this.F.PART_BOUNDARY) {
                            index = 0;
                            if (c == LF) {
                                // unset the PART_BOUNDARY flag
                                flags &= ~this.F.PART_BOUNDARY;
                                callback('partEnd');
                                callback('partBegin');
                                state = this.STATE.HEADER_FIELD_START;
                                break;
                            }
                        }
                        else if (flags & this.F.LAST_BOUNDARY) {
                            if (c == HYPHEN) {
                                callback('partEnd');
                                callback('end');
                                state = this.STATE.END;
                                flags = 0;
                            }
                            else {
                                index = 0;
                            }
                        }
                        else {
                            index = 0;
                        }
                    }
                    if (index > 0) {
                        lookbehind[index - 1] = c; // ------------------------> WHEN MATCHING A POSSIBLE BOUNDARY, KEEP A LOOKBEHIND REFERENCE IN CASE IT TURNS OUT TO BE A FALSE LEAD
                    }
                    else if (prevIndex > 0) {
                        callback('partData', lookbehind, 0, prevIndex); // ---> IF OUR BOUNDARY TURNED OUT TO BE RUBBISH, THE CAPTURED LOOKBEHIND BELONGS TO PARTDATA
                        prevIndex = 0;
                        mark('partData');
                        i--; // ----------------------------------------------> RECONSIDER THE CURRENT CHARACTER EVEN SO IT INTERRUPTED THE SEQUENCE IT COULD BE THE BEGINNING OF A NEW SEQUENCE
                    }
                    break;
                case this.STATE.END:
                    break;
                default:
                    return i;
            }
        }
        dataCallback('headerField');
        dataCallback('headerValue');
        dataCallback('partData');
        this.index = index;
        this.state = state;
        this.flags = flags;
        return len;
    },
    end: function() {
        var callback = function(self, name) {
            var callbackSymbol = 'on' + name.substr(0, 1).toUpperCase() + name.substr(1);
            var fn = self[callbackSymbol];
            return fn && fn();
        };
        if ((this.state == this.STATE.HEADER_FIELD_START && this.index === 0) || (this.state == this.STATE.PART_DATA && this.index == this.boundary.length)) {
            callback(this, 'partEnd');
            callback(this, 'end');
        }
        else if (this.state != this.STATE.END) {
            return new Error('MultipartParser.end(): stream ended unexpectedly: ' + this.explain());
        }
    },
    explain: function() {
        return 'state = ' + this.stateToString(this.state);
    }
};
/* eslint-enable no-fallthrough */
