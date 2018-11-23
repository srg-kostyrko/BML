const { testTag } = require('../helpers/tags');
const {
  bytes,
  greedy_bytes,
  string,
  constant,
  ConstantError,
} = require('../../lib');

describe('constant', () => {
  testTag(constant(string(4), 'RIM4')(), [82, 73, 77, 52], 'RIM4');
  it('should work with arrays', () => {
    const matchArray = constant(bytes(4), [1, 2, 3, 4])();

    expect(matchArray.parse(new Uint8Array([1, 2, 3, 4]))).toEqual([
      1,
      2,
      3,
      4,
    ]);
    expect(() =>
      matchArray.parse(new Uint8Array([82, 73, 77, 53]))
    ).toThrowError(ConstantError);

    const wrongMatch = constant(greedy_bytes(), [1, 2, 3, 4])();

    expect(() =>
      wrongMatch.parse(new Uint8Array([1, 2, 3, 4, 5]))
    ).toThrowError(ConstantError);

    const wrongType = constant(string(4), [82, 73, 77, 52])();
    expect(() =>
      wrongType.parse(new Uint8Array([82, 73, 77, 52]))
    ).toThrowError(ConstantError);
  });
  it('should throw error if not parsed', () => {
    const magicString = constant(string(4), 'RIM4')();
    expect(() =>
      magicString.parse(new Uint8Array([82, 73, 77, 53]))
    ).toThrowError(ConstantError);
  });
});
