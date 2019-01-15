import { IContext, IStream } from '../contracts';

import { Tag, createTag, unwrapTag, TagOrWrapper } from './tag';

export type BitMap = {
  [key: string]: number;
};
export type BitMaskResults = {
  [key: string]: boolean;
};

class BitMask extends Tag<BitMaskResults> {
  subTag: Tag<number>;
  bitMap: BitMap;
  constructor(subTag: TagOrWrapper<number>, bitMap: BitMap) {
    super();
    this.subTag = unwrapTag(subTag);
    this.bitMap = bitMap;
  }

  parse(stream: IStream, context: IContext) {
    const parsedValue = this.subTag.parse(stream, context);
    const result: BitMaskResults = {};
    for (const key of Object.keys(this.bitMap)) {
      result[key] = Boolean(parsedValue & this.bitMap[key]);
    }
    return result;
  }

  pack(stream: IStream, data: BitMaskResults, context: IContext) {
    let value = 0;
    for (const key of Object.keys(this.bitMap)) {
      if (data[key]) {
        value |= this.bitMap[key];
      }
    }
    this.subTag.pack(stream, value, context);
  }
}

export function bitMask(subTag: TagOrWrapper<number>, bitMap: BitMap) {
  return createTag(BitMask, subTag, bitMap);
}
