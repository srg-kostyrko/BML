const { testTag } = require('../helpers/tags');
const { bit_mask, byte } = require('../../lib');

describe('bit_mask', () => {
  const testBitMask = bit_mask(byte, {
    one: 1,
    two: 2,
    four: 4,
    eight: 8,
  });
  testTag(testBitMask`one`(), [1], {
    one: true,
    two: false,
    four: false,
    eight: false,
  });
  testTag(testBitMask`two`(), [2], {
    one: false,
    two: true,
    four: false,
    eight: false,
  });
  testTag(testBitMask`four`(), [4], {
    one: false,
    two: false,
    four: true,
    eight: false,
  });
  testTag(testBitMask`eight`(), [8], {
    one: false,
    two: false,
    four: false,
    eight: true,
  });
  testTag(testBitMask`all`(), [15], {
    one: true,
    two: true,
    four: true,
    eight: true,
  });
  testTag(testBitMask`none`(), [16], {
    one: false,
    two: false,
    four: false,
    eight: false,
  });
});
