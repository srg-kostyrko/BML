const { testTag } = require('../helpers/tags');
const {
  int8,
  uint8,
  int16,
  uint16,
  int32,
  uint32,
  float32,
  float64,
  byte,
  short,
  int,
  float,
  double,
} = require('../../lib');

describe('primitive ints', () => {
  testTag(byte(), [0xff], 255, 1);
  testTag(short(), [0x00, 0xff], 255, 2);
  testTag(int(), [0x00, 0x00, 0x00, 0xff], 255, 4);

  testTag(uint8(), [0x01], 0x01, 1);
  testTag(uint16(), [0x01, 0x02], 0x0102, 2);
  testTag(uint32(), [0x01, 0x02, 0x03, 0x04], 0x01020304, 4);

  testTag(int8(), [0x01], 0x01, 1);
  testTag(int16(), [0x01, 0x02], 0x0102, 2);
  testTag(int32(), [0x01, 0x02, 0x03, 0x04], 0x01020304, 4);
  testTag(int8(), [0xff], -1, 1);
  testTag(int16(), [0xff, 0xff], -1, 2);
  testTag(int32(), [0xff, 0xff, 0xff, 0xff], -1, 4);
});

describe('primitive floats', () => {
  testTag(float(), [0, 0, 0, 0], 0, 4);
  testTag(
    float(),
    [64, 12, 204, 205, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2.200000047683716,
    4
  );
  testTag(float32(), [0, 0, 0, 0], 0, 4);
  testTag(
    float32(),
    [64, 12, 204, 205, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    2.200000047683716,
    4
  );

  testTag(double(), [0, 0, 0, 0, 0, 0, 0, 0], 0, 8);
  testTag(
    double(),
    [64, 1, 153, 153, 153, 153, 153, 154, 0, 0, 0, 0, 0, 0, 0, 0],
    2.2,
    8
  );
  testTag(float64(), [0, 0, 0, 0, 0, 0, 0, 0], 0, 8);
  testTag(
    float64(),
    [64, 1, 153, 153, 153, 153, 153, 154, 0, 0, 0, 0, 0, 0, 0, 0],
    2.2,
    8
  );
});
