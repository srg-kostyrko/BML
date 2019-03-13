import { testTag } from '../helpers/tags';
import {
  bytes,
  greedyBytes,
  string,
  constant,
  ConstantError,
  parse,
} from '../../src';

describe('constant', () => {
  testTag(constant(string(4), 'RIM4')(), [82, 73, 77, 52], 'RIM4');
  it('should work with arrays', () => {
    const matchArray = constant(bytes(4), [1, 2, 3, 4]);

    expect(parse(matchArray, new Uint8Array([1, 2, 3, 4]))).toEqual([
      1,
      2,
      3,
      4,
    ]);
    expect(() =>
      parse(matchArray, new Uint8Array([82, 73, 77, 53]))
    ).toThrowError(ConstantError);

    const wrongMatch = constant(greedyBytes, [1, 2, 3, 4]);

    expect(() =>
      parse(wrongMatch, new Uint8Array([1, 2, 3, 4, 5]))
    ).toThrowError(ConstantError);

    const wrongType = constant<unknown>(string(4), [82, 73, 77, 52]);
    expect(() =>
      parse(wrongType, new Uint8Array([82, 73, 77, 52]))
    ).toThrowError(ConstantError);
  });
  it('should throw error if not parsed', () => {
    const magicString = constant(string(4), 'RIM4');
    expect(() =>
      parse(magicString, new Uint8Array([82, 73, 77, 53]))
    ).toThrowError(ConstantError);
  });
});
