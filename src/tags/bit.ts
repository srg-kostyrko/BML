import { IStream, IContext } from '../contracts';

import { Adapter } from './adapter';
import { Tag, createTag } from './tag';

class Bit extends Tag<number> {
  parse(stream: IStream, context: IContext) {
    return stream.readBit();
  }

  pack(stream: IStream, data: number, context: IContext) {
    stream.writeBit(data);
  }
}

export const bit = createTag(Bit);

class BitFlag extends Adapter<number, boolean> {
  constructor(subTag = bit) {
    super(subTag);
  }

  decode(data: number, context: IContext) {
    return data !== 0;
  }

  encode(data: boolean, context: IContext) {
    return data ? 1 : 0;
  }
}

export const bitFlag = createTag(BitFlag);
