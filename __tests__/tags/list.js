const { testTag } = require('../helpers/tags');
const { list } = require('../../lib/tags/list');
const { byte } = require('../../lib/tags/primitives');

describe('list', () => {
  testTag(list`empty`(byte, 0), [], [], 0);
  testTag(list`4 bytes`(byte, 4), [49, 50, 51, 52], [49, 50, 51, 52], 4);

  const triple = list`3 bytes`(byte, 3);
  testTag(triple, [0x01, 0x02, 0x03], [1, 2, 3], 3);

  // assert d.parse(b"\x01\x02\x03additionalgarbage") == [1,2,3]
  // assert raises(d.parse, b"") == StreamError
  // assert raises(d.build, [1,2]) == RangeError
  // assert raises(d.build, [1,2,3,4,5,6,7,8]) == RangeError

  // d = Array(this.n, Byte)
  // common(d, b"\x01\x02\x03", [1,2,3], 3, n=3)

  // assert d.parse(b"\x01\x02\x03", n=3) == [1,2,3]
  // assert d.parse(b"\x01\x02\x03additionalgarbage", n=3) == [1,2,3]
  // assert raises(d.parse, b"", n=3) == StreamError
  // assert raises(d.build, [1,2], n=3) == RangeError
  // assert raises(d.build, [1,2,3,4,5,6,7,8], n=3) == RangeError
  // assert raises(d.sizeof) == SizeofError
  // assert raises(d.sizeof, n=3) == 3
});
