const { int16 } = require('./lib/tags/primitives');
const { struct } = require('./lib/tags/struct');

const p = struct``(int16`first`, int16`second`);
const input = new Uint8Array([3, 4, 3, 4]);

console.log(p.parse(input.buffer));
console.log(
  p.pack({
    first: 3,
    second: 666,
  })
);
