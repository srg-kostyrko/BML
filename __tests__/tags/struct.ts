import { testTag } from '../helpers/tags';
import { struct, byte, uint8, uint16 } from '../../src';

describe('struct', () => {
  testTag(struct()`empty`, [], {});

  testTag(struct(uint16`a`, uint8`b`)`flat`, [0x00, 0x01, 0x02], {
    a: 1,
    b: 2,
  });
  testTag(struct(struct(byte`b`)`a`)`nested`, [0x01], { a: { b: 1 } });
});
