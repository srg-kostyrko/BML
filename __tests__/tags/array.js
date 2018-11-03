const { testTag } = require('../helpers/tags');
const { array } = require('../../lib/tags/array');
const { byte } = require('../../lib/tags/primitives');

describe('array', () => {
  testTag(array(byte, 0)`empty`, [], [], 0);
  testTag(array(byte, 4)`4 bytes`, [49, 50, 51, 52], [49, 50, 51, 52], 4);

  const triple = array(byte, 3)`3 bytes`;
  testTag(triple, [0x01, 0x02, 0x03], [1, 2, 3], 3);
});
