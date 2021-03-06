'use strict';

const Module = require('module');
const path = require('path');
var EOL = process.platform === 'win32' ? '\r\n' : '\n';

module.exports = reblaze;

// Call with reblaze(object[, string][, object], function)
// modul is the "module" in the scope the function is being called. Pass this
// if you want the generated function to operate like it's in the same outer
// execution scope of the script calling reblaze().
function reblaze(vals, name, modul, fn) {
  if (typeof name !== 'string') {
    if (typeof name === 'function') {
      fn = name;
      modul = undefined;
    } else {
      fn = modul;
      modul = name;
    }
    name = '';
  } else if (typeof modul === 'function') {
    fn = modul;
    modul = undefined;
  } else if (typeof fn !== 'function') {
    throw new TypeError('fn must be a function');
  }
  name += '';

  // V8 will automatically throw if vals is not an object.
  var keys = Object.keys(vals);
  var regexp, fn_intro;

  var fn_name = name || fn.name;
  var fn_str = fn.toString();
  // The toString() of a generator should automatically remove whitespace.
  var is_gen = fn_str[8] === '*';
  var fn_len = fn_str.length;
  var fn_args = fn_str.substring(fn_str.indexOf('(') + 1, fn_str.indexOf(')'));
  var fn_body = fn_str.substring(fn_str.indexOf('{') + 1, fn_len - 1).trim();

  for (var i = 0; i < keys.length; i++) {
    // Infer if the key is being used as an object key.
    regexp = new RegExp('(\\w)(\\s)*\\\[\\(\\(' +
                        keys[i] +
                        '\\)\\)\\\]', 'g');
    fn_body = fn_body.replace(regexp, '$1.' + vals[keys[i]]);

    // Need to do this since String#replace() in V8 doesn't support the
    // optional third argument, flags, for global replacement.
    regexp = new RegExp('\\(\\(' + keys[i] + '\\)\\)', 'g');
    fn_body = fn_body.replace(regexp, vals[keys[i]]);
  }

  fn_intro = is_gen ? 'return function* ' : 'return function ';

  if (!(modul instanceof Module)) {
    return (new Function(fn_intro + fn_name +
                         '(' + fn_args + ') {' + EOL + fn_body + EOL + '}'))();
  }

  return (new Function('exports',
                       'require',
                       'module',
                       '__filename',
                       '__dirname',
                       fn_intro + fn_name +
                       '(' + fn_args + ') {' + EOL + fn_body + EOL + '}'))
                       (modul.exports,
                        modul.require,
                        modul,
                        modul.filename,
                        path.dirname(modul.filename));
}
