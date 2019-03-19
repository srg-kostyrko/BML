import {
  int8,
  uint8,
  int16,
  uint16,
  int24,
  uint24,
  int32,
  uint32,
  float32,
  float64,
  byte,
  short,
  int,
  float,
  double,
  struct,
  endian,
  Endian,
} from '../../src';
import { testTag } from '../helpers/tags';

describe('primitive ints', () => {
  testTag(byte, [0xff], 255);
  testTag(short, [0x00, 0xff], 255);
  testTag(int, [0x00, 0x00, 0x00, 0xff], 255);

  testTag(uint8, [0x01], 0x01);
  testTag(uint16, [0x01, 0x02], 0x0102);
  testTag(uint32, [0x01, 0x02, 0x03, 0x04], 0x01020304);

  testTag(int8, [0x01], 0x01);
  testTag(int16, [0x01, 0x02], 0x0102);
  testTag(int32, [0x01, 0x02, 0x03, 0x04], 0x01020304);
  testTag(int8, [0xff], -1);
  testTag(int16, [0xff, 0xff], -1);
  testTag(int32, [0xff, 0xff, 0xff, 0xff], -1);
});

describe('primitive floats', () => {
  testTag(float, [0, 0, 0, 0], 0);
  testTag(float, [64, 12, 204, 205], 2.200000047683716);
  testTag(float32, [0, 0, 0, 0], 0);
  testTag(float32, [64, 12, 204, 205], 2.200000047683716);

  testTag(double, [0, 0, 0, 0, 0, 0, 0, 0], 0);
  testTag(double, [64, 1, 153, 153, 153, 153, 153, 154], 2.2);
  testTag(float64, [0, 0, 0, 0, 0, 0, 0, 0], 0);
  testTag(float64, [64, 1, 153, 153, 153, 153, 153, 154], 2.2);
});

describe('uint24', () => {
  testTag(uint24, [0, 0, 0], 0);
  testTag(uint24, [0xbc, 0x61, 0x4e], 12345678);
  testTag(uint24, [0xff, 0xff, 0xff], 16777215);

  const uint24Le = struct(endian(Endian.LE), uint24`value`);
  testTag(uint24Le, [0, 0, 0], { value: 0 });
  testTag(uint24Le, [0x4e, 0x61, 0xbc], { value: 12345678 });
  testTag(uint24Le, [0xff, 0xff, 0xff], { value: 16777215 });
});

describe('int24', () => {
  testTag(int24, [0x80, 0x00, 0x01], -8388607);
  testTag(int24, [0x12, 0xd6, 0x87], 1234567);
  testTag(int24, [0x7f, 0xff, 0xff], 8388607);

  const int24Le = struct(endian(Endian.LE), int24`value`);
  testTag(int24Le, [0x01, 0x00, 0x80], { value: -8388607 });
  testTag(int24Le, [0x87, 0xd6, 0x12], { value: 1234567 });
  testTag(int24Le, [0xff, 0xff, 0x7f], { value: 8388607 });
});
