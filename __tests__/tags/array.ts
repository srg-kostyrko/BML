import { testTag } from '../helpers/tags';
import { array, greedyArray, greedyBytes, bytes } from '../../src/tags/array';
import { uint16, byte } from '../../src/tags/primitives';

describe('array', () => {
  testTag(array(byte, 0)`empty`, [], []);
  testTag(array(byte, 4)`4 bytes`, [49, 50, 51, 52], [49, 50, 51, 52]);
  testTag(array(byte, 3)`3 bytes`, [0x01, 0x02, 0x03], [1, 2, 3]);
});

describe('bytes', () => {
  testTag(bytes(0)`empty`, [], []);
  testTag(bytes(4)`4 bytes`, [49, 50, 51, 52], [49, 50, 51, 52]);
  testTag(bytes(3)`3 bytes`, [0x01, 0x02, 0x03], [1, 2, 3]);
});

describe('greedyArray', () => {
  const greedyArray16 = greedyArray(uint16);
  testTag(greedyArray16`empty`, [], []);
  testTag(greedyArray16`3 entries`, [1, 1, 2, 2, 3, 3], [257, 514, 771]);
});

describe('greedy_bytes', () => {
  testTag(greedyBytes`empty`, [], []);
  testTag(greedyBytes`3 entries`, [1, 2, 3], [1, 2, 3]);
});
