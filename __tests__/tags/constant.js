const { testTag } = require('../helpers/tags');
const { string, constant, ConstantError } = require('../../lib');

describe('constant', () => {
  testTag(constant(string(4), 'RIM4')(), [82, 73, 77, 52], 'RIM4', 4);
  it('should throw error if not parsed', () => {
    const magicString = constant(string(4), 'RIM4')();
    expect(() =>
      magicString.parse(new Uint8Array([82, 73, 77, 53]))
    ).toThrowError(ConstantError);
  });
});
