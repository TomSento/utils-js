exports.test = function(k, fn) {
    var cache = exports.malloc('__TEST');
    var tests = cache('tests') || [];
    tests.push(new Test(k, fn));
    cache('tests', tests);
    var initial = cache('initial') === undefined;
    if (initial) {
        runTests(tests);
        cache('initial', false);
    }
    function Assert() {
        var Co = function() {
            var self = this;
        };
        Co.prototype.ok = function() {
            console.log('--> OK');
        };
        Co.prototype.fail = function() {
            console.log('--> FAIL');
        };
        Co.prototype.expect = function() {
            console.log('--> EXPECT');
        };
        Co.prototype.async = function() {
            console.log('--> ASYNC');
        };
        return new Co();
    }
    function Test(k, fn) {
        var Co = function(k, fn) {
            var self = this;
            self.name = k;
            self.fn = fn;
            self.assert = new Assert();
            self.state = waitingState();
        };
        Co.prototype = {
            state: function(v) {
                if (v) {
                    this.state = v;
                }
                return this.state;
            },
            run: function() {

            }
        };
        return new Co(k, fn);
    }
    function runTests() {
        cache('currentTest', tests[0]);
        setInterval(function() {
            var curr = cache('currentTest');
            if (curr.state() === inProgressState()) {
                return;
            }
            if (curr.state() === waitingState()) {

            }
            // if (curr.) {

            // }

            var test = tests.shift();
            test.state(inProgressState());
            test.run();
        }, 1000);
    }
    function runNextTest(params) {

    }
    function waitingState() {
        return 'WAITING';
    }
    function inProgressState() {
        return 'IN_PROGRESS';
    }
    function doneState() {
        return 'DONE';
    }
};
