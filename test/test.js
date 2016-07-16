'use strict';

var reblaze = require('../lib/core.js');
var EOL = require('os').EOL;


// Test basic replacement.
function replace0() {
  return ((A)) + ((B)) + ((C)) + ((A));
}
var fn = reblaze({ A: 5, B: 7, C: 11 }, replace0);
assert_eq(fn.toString(),
          'function replace0() {' + EOL + 'return 5 + 7 + 11 + 5;' + EOL + '}');
assert_eq(fn(), 28);


// Test arguments are properly inserted.
function replace1(foo, bar) {
  return foo + bar + ((BAZ));
}
var fn = reblaze({ BAZ: 1 }, replace1);
assert_eq(fn.toString(),
          'function replace1(foo, bar) {' + EOL +
              'return foo + bar + 1;' + EOL + '}');
assert_eq(fn(2, 3), 6);


// Test property names are correctly replaced.
function replace2(foo) {
  return foo[((BAR))];
}
var fn = reblaze({ BAR: 'bar' }, replace2);
assert_eq(fn.toString(),
          'function replace2(foo) {' + EOL + 'return foo.bar;' + EOL + '}');
assert_eq(fn({ bar: 42 }), 42);


// Test multi property names replacement.
function replace3(foo) {
  return foo[((BAR))] + foo[((BAR))];
}
var fn = reblaze({ BAR: 'bar' }, replace3);
assert_eq(fn.toString(),
          'function replace3(foo) {' + EOL +
              'return foo.bar + foo.bar;' + EOL + '}');
assert_eq(fn({ bar: 13 }), 26);


// Test mixed replacement types.
function replace4(foo) {
  return foo[((BAR))] + ((BAZ));
}
var fn = reblaze({ BAR: 'bar', BAZ: 3 }, replace4);
assert_eq(fn.toString(),
          'function replace4(foo) {' + EOL + 'return foo.bar + 3;' + EOL + '}');
assert_eq(fn({ bar: 7 }), 10);


// Test multiline breaks.
// IMPORTANT: Do not mess with line break in this test.
function replace5(foo) {
  return foo
      [((BAR))];
}
var fn = reblaze({ BAR: 'bar' }, replace5);
assert_eq(fn.toString(),
          'function replace5(foo) {' + EOL + 'return foo.bar;' + EOL + '}');
assert_eq(fn({ bar: 13 }), 13);


// Test generator support
function* replace6(foo) { }
var fn = reblaze({ }, replace6);
assert_eq(typeof fn().next, 'function');


// Test renaming a named function.
function replace7(foo) {
  return foo[((BAR))];
}
var fn = reblaze({ BAR: 'bar' }, 'replaced', replace7);
assert_eq(fn.toString(),
          'function replaced(foo) {' + EOL + 'return foo.bar;' + EOL + '}');


// Test replacing with /
// TODO(trevnorris): What was this test added for?
function replace8() {
  return ((FOO));
}
var fn = reblaze({ FOO: '/baz/bam/boom' }, replace8);
//process._rawDebug(fn.toString());


function replace9(foop) {
  if (foop !== __filename) {
    throw new Error('foop !== filename');
  }
}
var fn = reblaze({}, module, replace9);
fn(__filename);


function log() {
  return console.log.apply(this, arguments);
}

function assert_eq(val0, val1) {
  if (val0 !== val1)
    throw new Error('Assertion Failed: \n' + val0 + '\n' + val1);
}

