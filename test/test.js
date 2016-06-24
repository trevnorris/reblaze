// Just run this file to check all tests.

var reblaze = require('../lib/core.js');


// Test basic replacement.
function replace0() {
  return ((A)) + ((B)) + ((C)) + ((A));
}
var fn = reblaze({ A: 5, B: 7, C: 11 }, replace0);
assert_eq(fn.toString(), 'function replace0() {return 5 + 7 + 11 + 5;}');
assert_eq(fn(), 28);


// Test arguments are properly inserted.
function replace1(foo, bar) {
  return foo + bar + ((BAZ));
}
var fn = reblaze({ BAZ: 1 }, replace1);
assert_eq(fn.toString(), 'function replace1(foo, bar) {return foo + bar + 1;}');
assert_eq(fn(2, 3), 6);


// Test property names are correctly replaced.
function replace2(foo) {
  return foo[((BAR))];
}
var fn = reblaze({ BAR: 'bar' }, replace2);
assert_eq(fn.toString(), 'function replace2(foo) {return foo.bar;}');
assert_eq(fn({ bar: 42 }), 42);


// Test multi property names replacement.
function replace3(foo) {
  return foo[((BAR))] + foo[((BAR))];
}
var fn = reblaze({ BAR: 'bar' }, replace3);
assert_eq(fn.toString(), 'function replace3(foo) {return foo.bar + foo.bar;}');
assert_eq(fn({ bar: 13 }), 26);


// Test mixed replacement types.
function replace4(foo) {
  return foo[((BAR))] + ((BAZ));
}
var fn = reblaze({ BAR: 'bar', BAZ: 3 }, replace4);
assert_eq(fn.toString(), 'function replace4(foo) {return foo.bar + 3;}');
assert_eq(fn({ bar: 7 }), 10);


// Test multiline breaks.
// IMPORTANT: Do not mess with line break in this test.
function replace5(foo) {
  return foo
      [((BAR))];
}
var fn = reblaze({ BAR: 'bar' }, replace5);
assert_eq(fn.toString(), 'function replace5(foo) {return foo.bar;}');
assert_eq(fn({ bar: 13 }), 13);


// Test generator support
function* replace6(foo) { }
var fn = reblaze({ }, replace6);
assert_eq(typeof fn().next, 'function');





function log() {
  return console.log.apply(this, arguments);
}

function assert_eq(val0, val1) {
  if (val0 !== val1)
    throw new Error('Assertion Failed: \n' + val0 + '\n' + val1);
}

