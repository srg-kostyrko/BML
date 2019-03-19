import { testTag } from '../helpers/tags';
import { byte, repeatUntil, repeatWhile, parse, pack } from '../../src';

describe('repeat_until', () => {
  testTag(repeatUntil(byte, () => true)`empty`, [], []);

  it('should stop parsing', () => {
    const parsed = parse(
      repeatUntil(byte, (ctx, el) => el > 52)`4 bytes`,
      new Uint8Array([49, 50, 51, 52, 62])
    );
    expect(parsed).toEqual([49, 50, 51, 52]);
  });

  it('should pack', () => {
    const packed = pack(repeatUntil(byte, (ctx, el) => el > 52)`4 bytes`, [
      49,
      50,
      51,
      52,
      62,
    ]);
    expect(new Uint8Array(packed)).toEqual(new Uint8Array([49, 50, 51, 52]));
  });
});

describe('repeat_while', () => {
  testTag(repeatWhile(byte, () => true)`empty`, [], []);

  it('should stop parsing', () => {
    const parsed = parse(
      repeatWhile(byte, (ctx, el) => el < 60)`4 bytes`,
      new Uint8Array([49, 50, 51, 52, 62])
    );
    expect(parsed).toEqual([49, 50, 51, 52]);
  });

  it('should pack', () => {
    const packed = pack(repeatWhile(byte, (ctx, el) => el < 60)`4 bytes`, [
      49,
      50,
      51,
      52,
      62,
    ]);
    expect(new Uint8Array(packed)).toEqual(new Uint8Array([49, 50, 51, 52]));
  });
});
