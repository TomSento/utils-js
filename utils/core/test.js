exports.test = function(k, fn, maxTimeout) {
    if (!k || typeof(k) !== 'string') {
        throw new Error('api-k');
    }
    if (typeof(fn) !== 'function') {
        throw new Error('api-fn');
    }
    // ------------------------------------------------------------------------> LOAD PROTOTYPES
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
    }
    TestRunner.prototype = {
        addTest: function(k, fn, maxTimeout) {
            var self = this;
            if (self.findTest(k)) {
                throw new Error('testDuplicate "' + k + '"');
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
    function Test(k, fn, emitter, maxTimeout) {
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
    }
    Test.prototype = {
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
    function Assert(testName, emitter) {
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
                self.emitter.trigger('assert.result', self.composeAssertionResult(b, undefined, null, new Error('assert.expect')));
            }
        };
        self.composeAssertionResult = function(msg, expected, actual, expectedValue, actualValue, err) {
            return {
                testName: self.testName,
                msg: msg,
                expected: expected,
                actual: actual,
                expectedValue: expectedValue,
                actualValue: actualValue,
                err: err
            };
        };
    }
    Assert.prototype = {
        ok: function(bool, actualValue, expectedValue, msg) {
            var self = this;
            self.assertionCounter++;
            if (bool) {
                return self.emitter.trigger('assert.result', self.composeAssertionResult(msg, true, true, expectedValue, actualValue, null));
            }
            else {
                return self.emitter.trigger('assert.result', self.composeAssertionResult(msg, true, false, expectedValue, actualValue, new Error('assert.ok')));
            }
        },
        async: function(expectedCallbacks) {
            var self = this;
            if (isNaN(parseInt(expectedCallbacks)) || expectedCallbacks <= 0) {
                throw new Error('api-expectedCallbacks');
            }
            self.isAsync = true;
            self.callbackCounter = expectedCallbacks;
            return self.callback;
        },
        expect: function(expectedAssertions) {
            var self = this;
            if (isNaN(parseInt(expectedAssertions)) || expectedAssertions <= 0) {
                throw new Error('api-expectedAssertions');
            }
            self.expectedAssertions = expectedAssertions;
        }
    };
    function TestResults() {
        var self = this;
        self.results = {};
        self.composeTestResult = function(results, passed) {
            return {
                results: results,
                passed: passed
            };
        };
    }
    TestResults.prototype = {
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
    function ResultLogger(env) {
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
        self.getAssertErrorsStr = function(results) {
            var b = '';
            for (var i = 0; i < results.length; i++) {
                var v = results[i];
                if (v.err) {
                    b += '  ---\n';
                    b += "  message: '" + v.msg + "'\n";
                    b += '  severity: failed\n';
                    b += '  expected: ' + v.expected + '\n';
                    b += '  actual: ' + v.actual + '\n';
                    b += '  expectedValue: ' + v.expectedValue + '\n';
                    b += '  actualValue: ' + v.actualValue + '\n';
                    b += '  stack: ' + v.err.stack + '\n';
                    b += '  ...\n';
                }
            }
            return b;
        };
    }
    ResultLogger.prototype = {
        logResults: function(results) {
            var self = this;
            results = self.prepareResults(results);
            var i = 0;
            for (var k in results.results) {
                if (results.results.hasOwnProperty(k)) {
                    self.logger.logTestResult(i, k, results.results[k].results, self.getAssertErrorsStr);
                    i++;
                }
            }
            self.logger.logFooter(results);
        }
    };
    function BrowserLogger() {
        var self = this;
        self.domReady = function(fn) {
            var d = document;
            if (d.readyState === 'complete' || d.readyState !== 'loading') {
                fn();
            }
            else {
                d.addEventListener('DOMContentLoaded', fn);
            }
        };
    }
    BrowserLogger.prototype = {
        initialLog: function() {
            var self = this;
            self.domReady(function() {
                var d = document;
                var el = d.getElementById('tests');
                if (!el) {
                    el = d.createElement('div');
                    el.setAttribute('id', 'tests');
                    el.style.fontFamily = '"Courier New", Courier, monospace';
                    el.style.fontSize = 12 + 'px';
                }
                var line = d.createElement('div');
                line.textContent = 'TAP version 13';
                el.appendChild(line);
                var body = d.querySelector('body');
                if (body) {
                    body.appendChild(el);
                }
            });
        },
        logTestResult: function(i, testName, results, getAssertErrorsStr) {
            var d = document;
            results = getAssertErrorsStr(results);
            var el = d.createElement('div');
            if (results) {
                el.style.color = 'red';
                el.textContent = 'not ok ' + (i + 1) + ' ' + testName;
                d.getElementById('tests').appendChild(el);
                el = d.createElement('pre');
                el.style.margin = '0 0 15px 0';
                el.style.fontFamily = 'inherit';
                el.textContent = results;
                d.getElementById('tests').appendChild(el);
            }
            else {
                el.textContent = 'ok ' + (i + 1) + ' ' + testName;
                d.getElementById('tests').appendChild(el);
            }
        },
        logFooter: function(results) {
            var d = document;
            var el = d.createElement('div');
            el.textContent = '1..' + (results.passed + results.failed);
            d.getElementById('tests').appendChild(el);
            el = d.createElement('div');
            el.textContent = '# pass ' + results.passed;
            d.getElementById('tests').appendChild(el);
            el = d.createElement('div');
            el.style.color = 'red';
            el.textContent = '# fail ' + results.failed;
            d.getElementById('tests').appendChild(el);
        }
    };
    function NodeLogger() {
    }
    NodeLogger.prototype = {
        initialLog: function() {
            console.log('TAP version 13');
        },
        logTestResult: function(i, testName, results, getAssertErrorsStr) {
            results = getAssertErrorsStr(results);
            if (results) {
                console.log('\x1b[31mnot ok ' + (i + 1) + ' ' + testName + '\x1b[0m');
                console.log(results);
            }
            else {
                console.log('ok ' + (i + 1) + ' ' + testName);
            }
        },
        logFooter: function(results) {
            console.log('1..' + (results.passed + results.failed));
            console.log('# pass ' + results.passed);
            console.log('\x1b[31m# fail ' + results.failed + '\x1b[0m');
        }
    };
    function EventEmitter() {
        this.fns = {};
    }
    EventEmitter.prototype = {
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
    // ------------------------------------------------------------------------> MAIN
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
};
