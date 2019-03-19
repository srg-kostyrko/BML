import { testTag } from '../helpers/tags';
import { bitMask, byte } from '../../src';

describe('bit_mask', () => {
  const testBitMask = bitMask(byte, {
    one: 1,
    two: 2,
    four: 4,
    eight: 8,
  });
  testTag(testBitMask`one`, [1], {
    one: true,
    two: false,
    four: false,
    eight: false,
  });
  testTag(testBitMask`two`, [2], {
    one: false,
    two: true,
    four: false,
    eight: false,
  });
  testTag(testBitMask`four`, [4], {
    one: false,
    two: false,
    four: true,
    eight: false,
  });
  testTag(testBitMask`eight`, [8], {
    one: false,
    two: false,
    four: false,
    eight: true,
  });
  testTag(testBitMask`all`, [15], {
    one: true,
    two: true,
    four: true,
    eight: true,
  });
  testTag(testBitMask`none`, [0], {
    one: false,
    two: false,
    four: false,
    eight: false,
  });
});
