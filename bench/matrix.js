var smalloc = require('smalloc');
var alloc = smalloc.alloc;
var reblaze = require('../lib/core.js');
var ROWS = (process.argv[2] >>> 0) || 19;
var COLS = (process.argv[3] >>> 0) || 23;
var ITER = (process.argv[4] >>> 0) || 1e6;


function Matrix(rows, cols) {
  this._rows = rows >>> 0;
  this._cols = cols >>> 0;
  this.sumCols = reblaze({
    'this._cols': this._cols,
    'this._rows': this._rows
  }, sumCols);

  alloc(this._rows * this._cols, this, smalloc.Types.Uint32);
}


Matrix.prototype.sumCols2 = sumCols;


function sumCols() {
  var sum = [];
  for (var i = 0; i < ((this._cols)); i++) {
    sum[i] = 0;
  }
  for (var i = 0; i < ((this._cols)) * ((this._rows)); i++) {
    sum[i % ((this._cols))] += this[i];
  }
  return sum;
}


var m = new Matrix(ROWS, COLS);
for (var i = 0; i < m._cols * m._rows; i++) {
  m[i] = i + 1;
}

var t = process.hrtime();
for (var i = 0; i < ITER; i++) {
  m.sumCols2();
}
printTime('standard: ', process.hrtime(t));

var t = process.hrtime();
for (var i = 0; i < ITER; i++) {
  m.sumCols();
}
printTime('reblaze:  ', process.hrtime(t));



function printTime(msg, t) {
  console.log(msg, ((t[0] * 1e9 + t[1]) / ITER).toFixed(1) + ' ns/op');
}
