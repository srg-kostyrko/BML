const { testTag } = require('../helpers/tags');
const { flag } = require('../../lib');

describe('flag', () => {
  testTag(flag(), [1], true);
  testTag(flag(), [0], false);

  it('shoud parse any non 0 values', () => {
    expect(flag().parse(new Uint8Array([12]))).toBe(true);
  });
});
