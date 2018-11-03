const { testTag } = require('../helpers/tags');
const { enumeration } = require('../../lib/tags/enum');
const { byte } = require('../../lib/tags/primitives');

describe('enum', () => {
  const testEnum = enumeration`powers`(byte, {
    one: 1,
    two: 2,
    four: 4,
    eight: 8,
  });
  testTag(testEnum, [0x01], 'one', 1);
  // testTag(testEnum, [0xff], 255, 1);

  expect(testEnum.parse(new Uint8Array([0x01]).buffer)).toBe('one');
  // expect(testEnum.parse(new Uint8Array([0xff]).buffer)).toBe(255);
  expect(testEnum.pack(8)).toEqual(new Uint8Array([0x08]).buffer);
  expect(testEnum.pack(255)).toEqual(new Uint8Array([0xff]).buffer);
  expect(testEnum.pack('eight')).toEqual(new Uint8Array([0x08]).buffer);
  // assert raises(d.build, "unknown") == MappingError
});
