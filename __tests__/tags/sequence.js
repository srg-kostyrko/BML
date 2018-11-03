const { testTag } = require('../helpers/tags');
const { sequence, uint8, uint16 } = require('../../lib');

describe('sequence', () => {
  testTag(sequence()`empty`, [], [], 0);
  testTag(sequence(uint8, uint16)`mixed`, [0x01, 0x00, 0x02], [1, 2], 3);
});
