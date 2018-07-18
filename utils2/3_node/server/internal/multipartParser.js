// https://raw.githubusercontent.com/felixge/node-formidable/v1.2.1/lib/multipart_parser.js

var Buffer = require('buffer').Buffer,
    F = {
        PART_BOUNDARY: 1,
        LAST_BOUNDARY: 2
    },

    LF = 10,
    CR = 13,
    SPACE = 32,
    HYPHEN = 45,
    COLON = 58,
    A = 97,
    Z = 122,

    lower = function(c) {
        return c | 0x20;
    };

function MultipartParser() {
    this.boundary = null;
    this.boundaryChars = null;
    this.lookbehind = null;

    var s = 0;
    this.S = {
        PARSER_UNINITIALIZED: s++,
        START: s++,
        START_BOUNDARY: s++,
        HEADER_FIELD_START: s++,
        HEADER_FIELD: s++,
        HEADER_VALUE_START: s++,
        HEADER_VALUE: s++,
        HEADER_VALUE_ALMOST_DONE: s++,
        HEADERS_ALMOST_DONE: s++,
        PART_DATA_START: s++,
        PART_DATA: s++,
        PART_END: s++,
        END: s++
    };
    this.state = this.S.PARSER_UNINITIALIZED;

    this.index = null;
    this.flags = 0;
}
exports.MultipartParser = MultipartParser;

MultipartParser.stateToString = function(stateNumber) {
    for (var state in this.S) {
        var number = this.S[state];
        if (number === stateNumber) return state;
    }
};

MultipartParser.prototype.initWithBoundary = function(str) {
    this.boundary = new Buffer(str.length + 4);
    this.boundary.write('\r\n--', 0);
    this.boundary.write(str, 4);
    this.lookbehind = new Buffer(this.boundary.length + 8);
    this.state = this.S.START;

    this.boundaryChars = {};
    for (var i = 0; i < this.boundary.length; i++) {
        this.boundaryChars[this.boundary[i]] = true;
    }
};

MultipartParser.prototype.write = function(buffer) {
    var self = this,
        i = 0,
        len = buffer.length,
        prevIndex = this.index,
        index = this.index,
        state = this.state,
        flags = this.flags,
        lookbehind = this.lookbehind,
        boundary = this.boundary,
        boundaryChars = this.boundaryChars,
        boundaryLength = this.boundary.length,
        boundaryEnd = boundaryLength - 1,
        bufferLength = buffer.length,
        c,
        cl,

        mark = function(name) {
            self[name + 'Mark'] = i;
        },
        clear = function(name) {
            delete self[name + 'Mark'];
        },
        callback = function(name, buffer, start, end) {
            if (start !== undefined && start === end) {
                return;
            }

            var callbackSymbol = 'on' + name.substr(0, 1).toUpperCase() + name.substr(1);
            if (callbackSymbol in self) {
                self[callbackSymbol](buffer, start, end);
            }
        },
        dataCallback = function(name, clear) {
            var markSymbol = name + 'Mark';
            if (!(markSymbol in self)) {
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
        };

    for (i = 0; i < len; i++) {
        c = buffer[i];
        switch (state) {
            case this.S.PARSER_UNINITIALIZED:
                return i;
            case this.S.START:
                index = 0;
                state = this.S.START_BOUNDARY;
            case this.S.START_BOUNDARY:
                if (index == boundary.length - 2) {
                    if (c == HYPHEN) {
                        flags |= F.LAST_BOUNDARY;
                    }
                    else if (c != CR) {
                        return i;
                    }
                    index++;
                    break;
                }
                else if (index - 1 == boundary.length - 2) {
                    if (flags & F.LAST_BOUNDARY && c == HYPHEN) {
                        callback('end');
                        state = this.S.END;
                        flags = 0;
                    }
                    else if (!(flags & F.LAST_BOUNDARY) && c == LF) {
                        index = 0;
                        callback('partBegin');
                        state = this.S.HEADER_FIELD_START;
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
            case this.S.HEADER_FIELD_START:
                state = this.S.HEADER_FIELD;
                mark('headerField');
                index = 0;
            case this.S.HEADER_FIELD:
                if (c == CR) {
                    clear('headerField');
                    state = this.S.HEADERS_ALMOST_DONE;
                    break;
                }

                index++;
                if (c == HYPHEN) {
                    break;
                }

                if (c == COLON) {
                    if (index == 1) {
                        // empty header field
                        return i;
                    }
                    dataCallback('headerField', true);
                    state = this.S.HEADER_VALUE_START;
                    break;
                }

                cl = lower(c);
                if (cl < A || cl > Z) {
                    return i;
                }
                break;
            case this.S.HEADER_VALUE_START:
                if (c == SPACE) {
                    break;
                }

                mark('headerValue');
                state = this.S.HEADER_VALUE;
            case this.S.HEADER_VALUE:
                if (c == CR) {
                    dataCallback('headerValue', true);
                    callback('headerEnd');
                    state = this.S.HEADER_VALUE_ALMOST_DONE;
                }
                break;
            case this.S.HEADER_VALUE_ALMOST_DONE:
                if (c != LF) {
                    return i;
                }
                state = this.S.HEADER_FIELD_START;
                break;
            case this.S.HEADERS_ALMOST_DONE:
                if (c != LF) {
                    return i;
                }

                callback('headersEnd');
                state = this.S.PART_DATA_START;
                break;
            case this.S.PART_DATA_START:
                state = this.S.PART_DATA;
                mark('partData');
            case this.S.PART_DATA:
                prevIndex = index;

                if (index === 0) {
                    // boyer-moore derrived algorithm to safely skip non-boundary data
                    i += boundaryEnd;
                    while (i < bufferLength && !(buffer[i] in boundaryChars)) {
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
                        // CR = part boundary
                        flags |= F.PART_BOUNDARY;
                    }
                    else if (c == HYPHEN) {
                        // HYPHEN = end boundary
                        flags |= F.LAST_BOUNDARY;
                    }
                    else {
                        index = 0;
                    }
                }
                else if (index - 1 == boundary.length) {
                    if (flags & F.PART_BOUNDARY) {
                        index = 0;
                        if (c == LF) {
                            // unset the PART_BOUNDARY flag
                            flags &= ~F.PART_BOUNDARY;
                            callback('partEnd');
                            callback('partBegin');
                            state = this.S.HEADER_FIELD_START;
                            break;
                        }
                    }
                    else if (flags & F.LAST_BOUNDARY) {
                        if (c == HYPHEN) {
                            callback('partEnd');
                            callback('end');
                            state = this.S.END;
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
                    // when matching a possible boundary, keep a lookbehind reference
                    // in case it turns out to be a false lead
                    lookbehind[index - 1] = c;
                }
                else if (prevIndex > 0) {
                    // if our boundary turned out to be rubbish, the captured lookbehind
                    // belongs to partData
                    callback('partData', lookbehind, 0, prevIndex);
                    prevIndex = 0;
                    mark('partData');

                    // reconsider the current character even so it interrupted the sequence
                    // it could be the beginning of a new sequence
                    i--;
                }

                break;
            case this.S.END:
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
};

MultipartParser.prototype.end = function() {
    var callback = function(self, name) {
        var callbackSymbol = 'on' + name.substr(0, 1).toUpperCase() + name.substr(1);
        if (callbackSymbol in self) {
            self[callbackSymbol]();
        }
    };
    if ((this.state == this.S.HEADER_FIELD_START && this.index === 0) ||
        (this.state == this.S.PART_DATA && this.index == this.boundary.length)) {
        callback(this, 'partEnd');
        callback(this, 'end');
    }
    else if (this.state != this.S.END) {
        return new Error('MultipartParser.end(): stream ended unexpectedly: ' + this.explain());
    }
};

MultipartParser.prototype.explain = function() {
    return 'state = ' + MultipartParser.stateToString(this.state);
};
