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
  testTag(array(byte, 0)`empty`(), [], []);
  testTag(array(byte, 4)`4 bytes`(), [49, 50, 51, 52], [49, 50, 51, 52]);
  testTag(array(byte, 3)`3 bytes`(), [0x01, 0x02, 0x03], [1, 2, 3]);
});

describe('bytes', () => {
  testTag(bytes(0)`empty`(), [], []);
  testTag(bytes(4)`4 bytes`(), [49, 50, 51, 52], [49, 50, 51, 52]);
  testTag(bytes(3)`3 bytes`(), [0x01, 0x02, 0x03], [1, 2, 3]);
});

describe('greedy_array', () => {
  const greedyArray = greedy_array(uint16);
  testTag(greedyArray`empty`(), [], []);
  testTag(greedyArray`3 entries`(), [1, 1, 2, 2, 3, 3], [257, 514, 771]);
});

describe('greedy_bytes', () => {
  const greedyBytes = greedy_bytes();
  testTag(greedyBytes`empty`(), [], []);
  testTag(greedyBytes`3 entries`(), [1, 2, 3], [1, 2, 3]);
});
