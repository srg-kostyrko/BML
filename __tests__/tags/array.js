const { testTag } = require('../helpers/tags');
const { array } = require('../../lib/tags/array');
const { byte } = require('../../lib/tags/primitives');

describe('list', () => {
  testTag(array`empty`(byte, 0), [], [], 0);
  testTag(array`4 bytes`(byte, 4), [49, 50, 51, 52], [49, 50, 51, 52], 4);

  const triple = array`3 bytes`(byte, 3);
  testTag(triple, [0x01, 0x02, 0x03], [1, 2, 3], 3);
});
