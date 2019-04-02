import { testTag } from '../helpers/tags';
import { enums, byte, parse, pack } from '../../src';

enum MapEnum {
  First,
  Second,
}

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

  describe('from map', () => {
    const testEnum = enums(
      byte,
      new Map([[MapEnum.First, 1], [MapEnum.Second, 2]])
    );

    testTag(testEnum, [1], MapEnum.First);
    testTag(testEnum, [2], MapEnum.Second);
  });
});
