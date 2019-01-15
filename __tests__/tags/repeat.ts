import { testTag } from '../helpers/tags';
import { byte, repeatUntil, repeatWhile } from '../../src';

describe('repeat_until', () => {
  testTag(repeatUntil(byte, () => true)`empty`, [], []);
  testTag(
    repeatUntil(byte, (ctx, el) => el > 52)`4 bytes`,
    [49, 50, 51, 52, 62],
    [49, 50, 51, 52]
  );
});

describe('repeat_while', () => {
  testTag(repeatWhile(byte, () => true)`empty`, [], []);
  testTag(
    repeatWhile(byte, (ctx, el) => el < 60)`4 bytes`,
    [49, 50, 51, 52, 62],
    [49, 50, 51, 52]
  );
});
