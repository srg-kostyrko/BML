import { testTag } from '../helpers/tags';
import { flag, parse } from '../../src';

describe('flag', () => {
  testTag(flag, [1], true);
  testTag(flag, [0], false);

  it('shoud parse any non 0 values', () => {
    expect(parse(flag, new Uint8Array([12]))).toBe(true);
  });
});
