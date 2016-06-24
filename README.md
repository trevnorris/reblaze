```
          _     _
         | |   | |
 _ __ ___| |__ | | __ _ _______
| '__/ _ \ '_ \| |/ _` |_  / _ \
| | |  __/ |_) | | (_| |/ /  __/
|_|  \___|_.__/|_|\__,_/___\___|
```

A crazy way of template-izing your JS `Functions` and `Generators` so it can be
generated on the fly.

This should be used for methods that are instantiated once then used many
times, since currently the function generation does take quite a bit of time to
do.

Let's show a simple example then allow you to go experiment.

```javascript
'use strict';

const reblaze = require('reblaze');

function Matrix(rows, cols) {
  this._rows = rows >>> 0;
  this._cols = cols >>> 0;
  // Replace template entries with fields in passed object.
  this.sumCols = reblaze({ COLS: this._cols, ROWS: this._rows }, sumCols);

  this._data = new Uint32Array(this._rows * this._cols);
}

// This will look funky due to the template convention.
function sumCols() {
  const data = this._data;
  // Sum of values may exceed a uint32
  const sum = new Float64Array(((COLS)));
  for (var i = 0; i < ((COLS)) * ((ROWS)); i++) {
    sum[i % ((COLS))] += data[i];
  }
  return sum;
}

// Build a new Matrix instance with custom sumCols().
const m = new Matrix(11, 7);
```

Now `sumCols` on the instance `m`:

```javascript
function sumCols() {
  const data = this._data;
  const sum = new Float64Array(7);
  for (var i = 0; i < 7 * 11; i++) {
    sum[i % 7] += this[i];
  }
  return sum;
}
```

It will also automatically take care of object properties as well. For example:

```javascript
function runMe(foo) {
  return foo[((BAR))];
}

var fn = reblaze({ BAR: 'bar' }, runMe);
```

And the output for the new `fn` instance:

```javascript
function runMe(foo) {
  return foo.bar;
}
```

So, give it a whirl and report any bugs. In the future I plan on implementing
even more meta-ness where `reblaze` can run on itself and return optimized
instances for a given construction case.
