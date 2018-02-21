// /* eslint-disable */
exports.test = function(k, fn, maxTimeout) {
    if (!k || typeof(k) !== 'string') {
        throw new Error('invalidParameter');
    }
    if (typeof(fn) !== 'function') {
        throw new Error('invalidParameter');
    }
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
            self.results = new TestResults();
            self.logger = new ResultLogger(env);
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
                var self = this;
                self.logger.logResults(self.results.results);
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
                self.emitter.on('assert.result', function(result) {
                    self.results.push(result);
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
            self.assert = new Assert(k, emitter);
            self.maxTimeout = maxTimeout || 20000;
            self.execTime = 0;
            self.startInterval = function() {
                self.interval = setInterval(function() {
                    self.execTime += 500;
                    if (self.execTime >= self.maxTimeout) {
                        var err = new Error("Test '" + self.id + "' exceeded maxTimeout " + self.maxTimeout + 'ms.');
                        return self.emitter.trigger('error', [err, 'timingError']);
                    }
                }, 500);
            };
            self.runNextTest = function() {
                clearInterval(self.interval);
                self.assert.onTestEnd();
                self.emitter.trigger('runNextTest');
            };
        };
        Co.prototype = {
            run: function() {
                var self = this;
                self.startInterval();
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
    function Assert(testName, emitter) {
        var Co = function() {
            var self = this;
            self.testName = testName;
            self.emitter = emitter;
            self.isAsync = false;
            self.callbackCounter = -1;
            self.expectedAssertions = 0;
            self.assertionCounter = 0;
            self.callback = function() { // ASYNC TEST CALLBACK(S)
                self.callbackCounter--;
                if (self.callbackCounter === 0) {
                    self.emitter.trigger('assert.asyncTestEnded');
                }
            };
            self.onTestEnd = function() {
                if (self.expectedAssertions > 0 && self.expectedAssertions !== self.assertionCounter) {
                    var b = 'Expected ' + self.expectedAssertions;
                    b += self.expectedAssertions === 1 ? ' assertion' : ' assertions';
                    b += ', but ' + self.assertionCounter;
                    b += self.assertionCounter === 1 ? ' was run.' : ' were run.';
                    self.emitter.trigger('assert.result', self.composeAssertionResult(b, undefined, null, new Error('assert.notOk')));
                }
            };
            self.composeAssertionResult = function(msg, expected, actual, err) {
                return {
                    testName: self.testName,
                    msg: msg,
                    expected: expected,
                    actual: actual,
                    err: err
                };
            };
        };
        Co.prototype = {
            ok: function(bool, msg) {
                var self = this;
                self.assertionCounter++;
                if (bool) {
                    return self.emitter.trigger('assert.result', self.composeAssertionResult(msg, true, true, null));
                }
                else {
                    return self.emitter.trigger('assert.result', self.composeAssertionResult(msg, true, false, new Error('assert.ok')));
                }
            },
            notOk: function(bool, msg) {
                var self = this;
                self.assertionCounter++;
                if (!bool) {
                    return self.emitter.trigger('assert.result', self.composeAssertionResult(msg, false, false, null));
                }
                else {
                    return self.emitter.trigger('assert.result', self.composeAssertionResult(msg, false, true, new Error('assert.notOk')));
                }
            },
            async: function(expectedCallbacks) {
                var self = this;
                if (isNaN(parseInt(expectedCallbacks)) || expectedCallbacks <= 0) {
                    throw new Error('invalidParameter');
                }
                self.isAsync = true;
                self.callbackCounter = expectedCallbacks;
                return self.callback;
            },
            expect: function(expectedAssertions) {
                var self = this;
                if (isNaN(parseInt(expectedAssertions)) || expectedAssertions <= 0) {
                    throw new Error('invalidParameter');
                }
                self.expectedAssertions = expectedAssertions;
            }
        };
        return new Co();
    }
    function TestResults() {
        var Co = function() {
            var self = this;
            self.results = {};
            self.composeTestResult = function(results, passed) {
                return {
                    results: results,
                    passed: passed
                };
            };
        };
        Co.prototype = {
            push: function(result) {
                var self = this;
                if (!self.results[result.testName]) {
                    self.results[result.testName] = self.composeTestResult([], true);
                }
                self.results[result.testName].results.push(result);
                if (result.err) {
                    self.results[result.testName].passed = false;
                }
            }
        };
        return new Co();
    }
    function ResultLogger(env) {
        var Co = function() {
            var self = this;
            self.logger = env.isNode() ? new NodeLogger() : new BrowserLogger();
            self.logger.initialLog();
            self.composeResultsForLogger = function(results, passed, failed) {
                return {
                    results: results,
                    passed: passed,
                    failed: failed
                };
            };
            self.prepareResults = function(results) {
                var passed = 0;
                var failed = 0;
                for (var k in results) {
                    if (results.hasOwnProperty(k)) {
                        var v = results[k];
                        if (v.passed) {
                            passed++;
                        }
                        else {
                            failed++;
                        }
                    }
                }
                return self.composeResultsForLogger(results, passed, failed);
            };
        };
        Co.prototype = {
            logResults: function(results) {
                var self = this;
                results = self.prepareResults(results);
                self.logger.logResults(results);
            }
        };
        return new Co();
    }
    function BrowserLogger() {
        var Co = function() {
        };
        return new Co();
    }
    function NodeLogger() {
        var Co = function() {
            var self = this;
            self.logTestResult = function(i, testName, results) {
                results = self.getAssertErrorsStr(results);
                if (results) {
                    console.log('\x1b[31mnot ok ' + (i + 1) + ' ' + testName + '\x1b[0m');
                    console.log(results);
                }
                else {
                    console.log('ok ' + (i + 1) + ' ' + testName);
                }
            };
            self.getAssertErrorsStr = function(results) {
                var b = '';
                for (var i = 0; i < results.length; i++) {
                    var v = results[i];
                    if (v.err) {
                        b += '  ---\n';
                        b += "  message: '" + v.msg + "'\n";
                        b += '  severity: failed\n';
                        b += '  actual: ' + v.actual + '\n';
                        b += '  expected: ' + v.expected + '\n';
                        b += '  stack: ' + v.err.stack + '\n';
                        b += '  ...\n';
                    }
                }
                return b;
            };
        };
        Co.prototype = {
            initialLog: function() {
                console.log('TAP version 13');
            },
            logResults: function(results) {
                var self = this;
                var i = 0;
                for (var k in results.results) {
                    if (results.results.hasOwnProperty(k)) {
                        self.logTestResult(i, k, results.results[k].results);
                        i++;
                    }
                }
                console.log('1..' + i);
                console.log('# pass ' + results.passed);
                console.log('\x1b[31m# fail ' + results.failed + '\x1b[0m');
            }
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
