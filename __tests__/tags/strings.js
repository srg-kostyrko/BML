const { testTag } = require('../helpers/tags');
const { string, pascal_string, c_string, byte } = require('../../lib');

describe('strings', () => {
  describe('string', () => {
    testTag(string(0)`empty`(), [], '', 0);
    testTag(string(4)`4 chars`(), [82, 73, 77, 52], 'RIM4', 4);
  });

  describe('pascal_string', () => {
    const empty = pascal_string(byte)();
    expect(empty.parse(new Uint8Array([0]))).toBe('');
    expect(empty.pack('')).toEqual(new Uint8Array([0]).buffer);

    const fourChars = pascal_string(byte)();
    expect(fourChars.parse(new Uint8Array([4, 82, 73, 77, 52]))).toBe('RIM4');
    expect(fourChars.pack('RIM4')).toEqual(
      new Uint8Array([4, 82, 73, 77, 52]).buffer
    );
  });

  describe('c_string', () => {
    const empty = c_string(byte)();
    expect(empty.parse(new Uint8Array([0]))).toBe('');
    expect(empty.pack('')).toEqual(new Uint8Array([0]).buffer);

    const fourChars = c_string()();
    expect(fourChars.parse(new Uint8Array([82, 73, 77, 52, 0]))).toBe('RIM4');
    expect(fourChars.pack('RIM4')).toEqual(
      new Uint8Array([82, 73, 77, 52, 0]).buffer
    );
  });
});
