// /* eslint-disable */
exports.test = function(k, fn, maxTimeout) {
    var cache = exports.malloc('__TEST');
    var runner = cache('runner');
    if (runner) {
        runner.addTest(k, fn, maxTimeout);
    }
    else {
        runner = new TestRunner();
        runner.addTest(k, fn, maxTimeout);
        runner.run();
        cache('runner', runner);
    }
    function TestRunner() {
        var Co = function() {
            var self = this;
            self.tests = [];
            self.emitter = new EventEmitter();
            self.terminated = false;
            self.finalizeTimeout = 5000;
            self.findTest = function(k) {
                for (var i = 0; i < self.tests.length; i++) {
                    var v = self.tests[i];
                    if (v && v.id === k) {
                        return v;
                    }
                }
                return null;
            };
            self.runNextTest = function(ms) {
                var test = self.tests.shift();
                console.log('--> OK test: ', test && test.id);
                if (test) {
                    test.run();
                }
                else {
                    if (ms >= self.finalizeTimeout) {
                        return self.finalize();
                    }
                    setTimeout(function() {
                        ms = ms || 0;
                        self.runNextTest(ms += 500);
                    }, 500);
                }
            };
            self.finalize = function() {
                console.log('RESULTS');
            };
            self.canRunNextTest = function() {
                return !self.terminated;
            };
        };
        Co.prototype = {
            addTest: function(k, fn, maxTimeout) {
                var self = this;
                if (self.findTest(k)) {
                    throw new Error('testDuplicate');
                }
                self.tests.push(new Test(k, fn, self.emitter, maxTimeout));
            },
            run: function() {
                var self = this;
                self.emitter.on('runNextTest', function() {
                    if (self.canRunNextTest()) {
                        self.runNextTest();
                    }
                });
                self.emitter.on('error', function(err) {
                    self.terminated = true;
                    console.log('ERR: ' + err.toString());
                });
                self.emitter.trigger('runNextTest');
            }
        };
        return new Co();
    }
    function Test(k, fn, emitter, maxTimeout) {
        var Co = function() {
            var self = this;
            self.id = k;
            self.fn = fn;
            self.emitter = emitter;
            self.assert = new Assert(emitter);
            self.maxTimeout = maxTimeout || 20000;
            self.execTime = 0;
            self.interval = setInterval(function() {
                self.execTime += 500;
            }, 500);
            self.runNextTest = function() {
                clearInterval(self.interval);
                if (self.execTime > self.maxTimeout) {
                    return self.emitter.trigger('error', new Error('execTimeExceeded'));
                }
                self.emitter.trigger('runNextTest');
            };
        };
        Co.prototype = {
            run: function() {
                var self = this;
                try {
                    self.fn(self.assert);
                }
                catch (error) {
                    return self.emitter.trigger('error', error);
                }
                if (self.isAsync()) {
                    self.emitter.on('assert.asyncTestEnded', function() {
                        self.runNextTest();
                    });
                }
                else {
                    self.runNextTest();
                }
            },
            isAsync: function() {
                var self = this;
                return self.assert.isAsync;
            }
        };
        return new Co();
    }
    function Assert(emitter) {
        var Co = function() {
            var self = this;
            self.emitter = emitter;
            self.isAsync = false;
            self.callbackCounter = -1;
            // self.assertionCounter = -1; // NUMBER OF ASSERTIONS FOR ONE TEST - V2
            self.callback = function() { // ASYNC TEST CALLBACK(S)
                self.callbackCounter--;
                if (self.callbackCounter === 0) {
                    self.emitter.trigger('assert.asyncTestEnded');
                }
            };
        };
        Co.prototype = {
            ok: function(i) {
                console.log('--> OK: ' + i);
            },
            fail: function(i) {
                console.log('--> FAIL: ' + i);
            },
            async: function(expectedCallbacks) {
                var self = this;
                console.log('--> ASYNC');
                if (expectedCallbacks <= 0) {
                    throw new Error('invalidParameter');
                }
                self.isAsync = true;
                self.callbackCounter = expectedCallbacks;
                return self.callback;
            }
            // expect: function(expectedAssertions) { V2
            //     console.log('--> EXPECT');
            //     self.assertionCounter = expectedAssertions;
            // },
        };
        return new Co();
    }
    function EventEmitter() {
        var Co = function() {
            this.fns = {};
        };
        Co.prototype = {
            on: function(k, fn) {
                this.fns[k] = fn;
            },
            trigger: function(k, v) {
                var fn = this.fns[k];
                if (fn) {
                    fn(v);
                }
            }
        };
        return new Co();
    }
};
