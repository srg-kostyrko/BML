const { testTag } = require('../helpers/tags');
const { sequence } = require('../../lib/tags/sequence');
const { uint8, uint16 } = require('../../lib/tags/primitives');

describe('sequence', () => {
  testTag(sequence`empty`(), [], [], 0);
  testTag(sequence`mixed`(uint8, uint16), [0x01, 0x00, 0x02], [1, 2], 3);
});
