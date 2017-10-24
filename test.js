var Table = require('cli-table');

var tables = new Table({
  head: ['row1', 'row2', 'row3']
, colWidths: [10, 70, 13]
, style: { 'padding-right': 0 }
, colAligns: []
});

tables.push(
  ['foo', 'bar', 'baz']
, ['frob', 'bar', 'quuz']
);

console.log(tables.toString());