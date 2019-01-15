import { testTag } from '../helpers/tags';
import { enums, byte, parse, pack } from '../../src';

describe('enums', () => {
  describe('from object', () => {
    const testEnum = enums(byte, {
      one: 1,
      two: 2,
      four: 4,
      eight: 8,
    });
    testTag(testEnum`powers`, [0x01], 'one');

    expect(parse(testEnum, new Uint8Array([0x01]))).toBe('one');
    expect(pack(testEnum, 'eight')).toEqual(new Uint8Array([0x08]).buffer);
  });

  describe('from array', () => {
    const testEnum = enums(byte, ['zero', 'one', 'two']);
    testTag(testEnum, [0x00], 'zero');
    testTag(testEnum, [0x01], 'one');
    testTag(testEnum, [0x02], 'two');
  });
});
