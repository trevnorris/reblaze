module.exports = reblaze;


function reblaze(vals, fn) {
  if (typeof fn !== 'function')
    throw new TypeError('fn should be a function');

  // V8 will automatically throw if vals is not an object.
  var keys = Object.keys(vals);
  // The toString() of a generator should automatically remove whitespace.
  var is_gen = fn[8] === '*';
  var regexp, fn_intro;

  var fn_name = fn.name;
  var fn_str = fn.toString();
  var fn_len = fn_str.length;
  var fn_args = fn_str.substring(fn_str.indexOf('(') + 1, fn_str.indexOf(')'));
  var fn_body = fn_str.substring(fn_str.indexOf('{') + 1, fn_len - 1).trim();

  // XXX: Thought, could I use mutable strings to not need to rewrite each
  // of these every time.
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

  return (new Function(fn_intro + fn_name +
                       '(' + fn_args + ') {' + fn_body + '}'))();
}

// TODO:
// - Allow code block segments in the function that are run at compilation
//   time, replacing code with the return values of the function.
// - Have the function auto recompile.
