const { testTag } = require('../helpers/tags');
const { array, byte, bytes } = require('../../lib');

describe('array', () => {
  testTag(array(byte, 0)`empty`(), [], [], 0);
  testTag(array(byte, 4)`4 bytes`(), [49, 50, 51, 52], [49, 50, 51, 52], 4);
  testTag(array(byte, 3)`3 bytes`(), [0x01, 0x02, 0x03], [1, 2, 3], 3);
});

describe('bytes', () => {
  testTag(bytes(0)`empty`(), [], [], 0);
  testTag(bytes(4)`4 bytes`(), [49, 50, 51, 52], [49, 50, 51, 52], 4);
  testTag(bytes(3)`3 bytes`(), [0x01, 0x02, 0x03], [1, 2, 3], 3);
});
