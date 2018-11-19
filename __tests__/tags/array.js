const { testTag } = require('../helpers/tags');
const {
  array,
  greedy_array,
  greedy_bytes,
  uint16,
  byte,
  bytes,
} = require('../../lib');

describe('array', () => {
  testTag(array(byte, 0)`empty`(), [], [], 0);
  testTag(array(byte, 4)`4 bytes`(), [49, 50, 51, 52], [49, 50, 51, 52], 4);
  testTag(array(byte, 3)`3 bytes`(), [0x01, 0x02, 0x03], [1, 2, 3], 3);
});

describe('bytes', () => {
  testTag(bytes(0)`empty`(), [], [], 0);
  testTag(bytes(4)`4 bytes`(), [49, 50, 51, 52], [49, 50, 51, 52], 4);
  testTag(bytes(3)`3 bytes`(), [0x01, 0x02, 0x03], [1, 2, 3], 3);
});

describe('greedy_array', () => {
  const greedyArray = greedy_array(uint16)();
  expect(greedyArray.parse(new Uint8Array([]))).toHaveLength(0);
  expect(greedyArray.pack([])).toEqual(new Uint8Array([]).buffer);

  const sample = new Uint8Array([1, 1, 2, 2, 3, 3]);
  expect(greedyArray.parse(sample)).toEqual([257, 514, 771]);
  expect(greedyArray.pack([257, 514, 771])).toEqual(sample.buffer);
});

describe('greedy_bytes', () => {
  const greedybytes = greedy_bytes()();
  expect(greedybytes.parse(new Uint8Array([]))).toHaveLength(0);
  expect(greedybytes.pack([])).toEqual(new Uint8Array([]).buffer);

  const sample = new Uint8Array([1, 2, 3]);
  expect(greedybytes.parse(sample)).toEqual([1, 2, 3]);
  expect(greedybytes.pack([1, 2, 3])).toEqual(sample.buffer);
});
