const { testTag } = require('../helpers/tags');
const { enumeration } = require('../../lib/tags/enum');
const { byte } = require('../../lib/tags/primitives');

describe('enum', () => {
  const testEnum = enumeration(byte, {
    one: 1,
    two: 2,
    four: 4,
    eight: 8,
  });
  testTag(testEnum`powers`, [0x01], 'one', 1);

  expect(testEnum().parse(new Uint8Array([0x01]))).toBe('one');
  expect(testEnum().pack(8)).toEqual(new Uint8Array([0x08]).buffer);
  expect(testEnum().pack(255)).toEqual(new Uint8Array([0xff]).buffer);
  expect(testEnum().pack('eight')).toEqual(new Uint8Array([0x08]).buffer);
});
