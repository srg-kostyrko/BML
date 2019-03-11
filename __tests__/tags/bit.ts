import { testTag } from '../helpers/tags';
import { bit, struct, sequence, bitFlag, byte } from '../../src';

describe('bit', () => {
  const testBit = sequence(bit, bit, bit, bit);
  testTag(testBit`bit`, [5], [1, 0, 1, 0]);
});

describe('bit mixed in other byte based tags', () => {
  const testBit = sequence(byte, bit, bit, bit, bit, byte);
  testTag(testBit`bit`, [2, 5, 3], [2, 1, 0, 1, 0, 3]);
});

describe('bits overflowing 1 byte', () => {
  const testBit = sequence(bit, bit, bit, bit, bit, bit, bit, bit, bit);
  testTag(testBit`bit`, [5, 1], [1, 0, 1, 0, 0, 0, 0, 0, 1]);
});

describe('bitFlag', () => {
  const testBitFlag = struct(
    bitFlag`first`,
    bitFlag`second`,
    bitFlag`third`,
    bitFlag`forth`
  );
  testTag(testBitFlag`bit`, [5], {
    first: true,
    second: false,
    third: true,
    forth: false,
  });
});
