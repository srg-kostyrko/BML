import { struct, sizedArray, lazyBound, byte, TagProducer } from '../../src';
import { testTag } from '../helpers/tags';

describe('lazy', () => {
  interface RecursiveTag {
    level: number;
    nested: RecursiveTag[];
  }
  const recursiveTag: TagProducer<RecursiveTag> = struct<RecursiveTag>(
    byte`level`,
    sizedArray(lazyBound(() => recursiveTag), byte)`nested`
  );
  const recursiveData = {
    level: 0,
    nested: [
      {
        level: 1,
        nested: [
          {
            level: 2,
            nested: [],
          },
        ],
      },
    ],
  };

  testTag(recursiveTag, [0, 1, 1, 1, 2, 0], recursiveData);
});
