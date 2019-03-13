import { testTag } from '../helpers/tags';
import { varint, pack } from '../../src';

describe('varint', () => {
  testTag(varint, [1], 1);
  testTag(varint, [0b10101100, 0b00000010], 300);

  it('should throw if packing negative number', () => {
    expect(() => {
      pack(varint, -1);
    }).toThrowError('varint cannot build from negative number: -1');
  });
});
