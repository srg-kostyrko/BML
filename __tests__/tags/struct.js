const { testTag } = require('../helpers/tags');
const { struct } = require('../../lib/tags/struct');
const { byte, uint8, uint16 } = require('../../lib/tags/primitives');

describe('struct', () => {
  testTag(struct`empty`(), [], {}, 0);
  testTag(
    struct`flat`(uint16`a`, uint8`b`),
    [0x00, 0x01, 0x02],
    { a: 1, b: 2 },
    3
  );
  testTag(struct`nested`(struct`a`(byte`b`)), [0x01], { a: { b: 1 } }, 1);
  // testTag(struct``(Const(b"\x00"), Padding(1), Pass, Terminated), bytes(2), {}, SizeofError)
  // assert raises(Struct("missingkey"/Byte).build, {}) == KeyError
  // assert raises(Struct(Bytes(this.missing)).sizeof) == SizeofError
  // d = Struct(Computed(7), Const(b"JPEG"), Pass, Terminated)
  // assert d.build(None) == d.build({})
  // def test_struct_proper_context():
  //     # adjusted to support new embedding semantics
  //     d1 = Struct(
  //         "x"/Byte,
  //         "inner"/Struct(
  //             "y"/Byte,
  //             "a"/Computed(this._.x+1),
  //             "b"/Computed(this.y+2),
  //         ),
  //         "c"/Computed(this.x+3),
  //         "d"/Computed(this.inner.y+4),
  //     )
  //     d2 = Struct(
  //         "x"/Byte,
  //         "inner"/Embedded(Struct(
  //             "y"/Byte,
  //             "a"/Computed(this.x+1),  # important
  //             "b"/Computed(this.y+2),  # important
  //         )),
  //         "c"/Computed(this.x+3),
  //         "d"/Computed(this.y+4),
  //     )
  //     assert d1.parse(b"\x01\x0f") == Container(x=1)(inner=Container(y=15)(a=2)(b=17))(c=4)(d=19)
  //     assert d2.parse(b"\x01\x0f") == Container(x=1)(y=15)(a=2)(b=17)(c=4)(d=19)

  // def test_struct_sizeof_context_nesting():
  //     st = Struct(
  //         "a" / Computed(1),
  //         "inner" / Struct(
  //             "b" / Computed(2),
  //             Check(this._.a == 1),
  //             Check(this.b == 2),
  //         ),
  //         Check(this.a == 1),
  //         Check(this.inner.b == 2),
  //     )
  //     st.sizeof()
});
