import { Context, Stream } from '../contracts';

import { Tag, createTag, unwrapTag, TagOrWrapper, TagProducer } from './tag';

export interface BitMap {
  [key: string]: number;
}
export interface BitMaskResults {
  [key: string]: boolean;
}

class BitMask extends Tag<BitMaskResults> {
  private subTag: Tag<number>;
  private bitMap: BitMap;

  public constructor(subTag: TagOrWrapper<number>, bitMap: BitMap) {
    super();
    this.subTag = unwrapTag(subTag);
    this.bitMap = bitMap;
  }

  public parse(stream: Stream, context: Context): BitMaskResults {
    const parsedValue = this.subTag.parse(stream, context);
    const result: BitMaskResults = {};
    for (const key of Object.keys(this.bitMap)) {
      result[key] = Boolean(parsedValue & this.bitMap[key]);
    }
    return result;
  }

  public pack(stream: Stream, data: BitMaskResults, context: Context): void {
    let value = 0;
    for (const key of Object.keys(this.bitMap)) {
      if (data[key]) {
        value |= this.bitMap[key];
      }
    }
    this.subTag.pack(stream, value, context);
  }
}

export function bitMask(
  subTag: TagOrWrapper<number>,
  bitMap: BitMap
): TagProducer<BitMaskResults> {
  return createTag(BitMask, subTag, bitMap);
}
