import { Stream } from '../contracts';

import { Adapter } from './adapter';
import { Tag, createTag } from './tag';

class Bit extends Tag<number> {
  public parse(stream: Stream): number {
    return stream.readBit();
  }

  public pack(stream: Stream, data: number): void {
    stream.writeBit(data);
  }
}

export const bit = createTag(Bit);

class BitFlag extends Adapter<number, boolean> {
  public constructor(subTag = bit) {
    super(subTag);
  }

  public decode(data: number): boolean {
    return data !== 0;
  }

  public encode(data: boolean): number {
    return data ? 1 : 0;
  }
}

export const bitFlag = createTag(BitFlag);
