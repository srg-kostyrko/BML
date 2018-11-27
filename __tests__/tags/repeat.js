const { testTag } = require('../helpers/tags');
const { byte, repeat_until, repeat_while } = require('../../lib');

describe('repeat_until', () => {
  testTag(repeat_until(byte, () => true)`empty`(), [], []);
  testTag(
    repeat_until(byte, (ctx, el) => el > 52)`4 bytes`(),
    [49, 50, 51, 52, 62],
    [49, 50, 51, 52]
  );
});

describe('repeat_while', () => {
  testTag(repeat_while(byte, () => true)`empty`(), [], []);
  testTag(
    repeat_while(byte, (ctx, el) => el < 60)`4 bytes`(),
    [49, 50, 51, 52, 62],
    [49, 50, 51, 52]
  );
});
