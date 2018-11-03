const { testTag } = require('../helpers/tags');
const { struct } = require('../../lib/tags/struct');
const { byte, uint8, uint16 } = require('../../lib/tags/primitives');

describe('struct', () => {
  testTag(struct()`empty`, [], {}, 0);
  testTag(
    struct(uint16`a`, uint8`b`)`flat`,
    [0x00, 0x01, 0x02],
    { a: 1, b: 2 },
    3
  );
  testTag(struct(struct(byte`b`)`a`)`nested`, [0x01], { a: { b: 1 } }, 1);
});
