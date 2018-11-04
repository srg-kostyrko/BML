const { testTag } = require('../helpers/tags');
const { enums, byte } = require('../../lib');

describe('enums', () => {
  const testEnum = enums(byte, {
    one: 1,
    two: 2,
    four: 4,
    eight: 8,
  });
  testTag(testEnum`powers`(), [0x01], 'one', 1);

  expect(testEnum().parse(new Uint8Array([0x01]))).toBe('one');
  expect(testEnum().pack(8)).toEqual(new Uint8Array([0x08]).buffer);
  expect(testEnum().pack(255)).toEqual(new Uint8Array([0xff]).buffer);
  expect(testEnum().pack('eight')).toEqual(new Uint8Array([0x08]).buffer);
});
