// /* eslint-disable */
exports.test = function(k, fn, maxTimeout) {
    var cache = exports.malloc('__TEST');
    var runner = cache('runner');
    var env = cache('env');
    if (env && runner) {
        runner.addTest(k, fn, maxTimeout);
    }
    else {
        env = getEnv();
        if (env) {
            cache('env', env);
            runner = new TestRunner(env);
            runner.addTest(k, fn, maxTimeout);
            runner.run();
            cache('runner', runner);
        }
        else {
            throw new Error('unknownEnvironment');
        }
    }
    function getEnv() {
        var Env = function(env, type) {
            var self = this;
            self.env = env;
            self.type = type;
            self.fns = {};
            if (self.type === 'BROWSER') {
                self.env.onerror = function(msg, url, lin, col, err) {
                    var fn = self.fns['windowError'];
                    if (fn) {
                        fn(err);
                        return true; // OVERRIDE DEFAULT BEHAVIOR
                    }
                };
            }
            else if (self.type === 'NODE') {
                self.env.on('uncaughtException', function(err) {
                    var fn = self.fns['uncaughtProcessException'];
                    if (fn) {
                        fn(err);
                    }
                });
                self.env.on('unhandledRejection', function(err) {
                    var fn = self.fns['unhandledProcessRejection'];
                    if (fn) {
                        fn(err);
                    }
                });
            }
        };
        Env.prototype = {
            isNode: function() {
                var self = this;
                return self.type === 'NODE';
            },
            on: function(k, fn) {
                var self = this;
                self.fns[k] = fn;
            }
        };
        if (typeof(process) === 'object') {
            return new Env(process, 'NODE');
        }
        else if (typeof(window) === 'object') {
            return new Env(window, 'BROWSER');
        }
        else {
            return null;
        }
    }
    function TestRunner(env) {
        var Co = function() {
            var self = this;
            self.env = env;
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
            self.env.on('windowError', function(err) {
                self.emitter.trigger('error', [err, 'windowError']);
            });
            self.env.on('uncaughtProcessException', function(err) {
                self.emitter.trigger('error', [err, 'uncaughtException']);
            });
            self.env.on('unhandledProcessRejection', function(err) {
                self.emitter.trigger('error', [err, 'unhandledRejection']);
            });
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
                    var msg = err[0] ? (': ' + err[0].stack) : '';
                    exports.logError('TEST ERROR DETECTION [ENV:' + self.env.type + '] (' + err[1] + ')' + msg);
                    if (self.env.isNode()) {
                        self.env.env.exit(1);
                    }
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
                    return self.emitter.trigger('error', [new Error('execTimeExceeded'), 'testError']);
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
                    return self.emitter.trigger('error', [error, 'syncError']);
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
