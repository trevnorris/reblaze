```
          _     _
         | |   | |
 _ __ ___| |__ | | __ _ _______
| '__/ _ \ '_ \| |/ _` |_  / _ \
| | |  __/ |_) | | (_| |/ /  __/
|_|  \___|_.__/|_|\__,_/___\___|
```

A crazy way of template-izing your JS so it can be generated on the fly.

This should be used for methods that are instantiated once then used many times,
since currently the function generation does take quite a bit of time to do.

Let's show a simple example then allow you to go experiment. (note this uses
the latest v0.12 `'smalloc'` API)

```javascript
var smalloc = require('smalloc');
var alloc = smalloc.alloc;
var reblaze = require('reblaze');


function Matrix(rows, cols) {
  this._rows = rows >>> 0;
  this._cols = cols >>> 0;
  // Replace template entries with fields in passed object.
  this.sumCols = reblaze({ COLS: this._cols, ROWS: this._rows }, sumCols);

  alloc(this._rows * this._cols, this, smalloc.Types.Uint32);
}

// This will look funky due to the template convention.
function sumCols() {
  var sum = [];
  for (var i = 0; i < (((COLS))); i++) {
    sum[i] = 0;
  }
  for (var i = 0; i < (((COLS))) * (((ROWS))); i++) {
    sum[i % (((COLS)))] += this[i];
  }
  return sum;
}


var m = new Matrix(11, 7);
```

Now `sumCols` on the instance `m`:

```javascript
function sumCols() {
  var sum = [];
  for (var i = 0; i < 7; i++) {
    sum[i] = 0;
  }
  for (var i = 0; i < 7 * 11; i++) {
    sum[i % 7] += this[i];
  }
  return sum;
}
```

It will also automatically take care of object properties as well. For example:

```javascript
function runMe(foo) {
  return foo[(((BAR)))];
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
