import { Stream } from '../contracts';

import { createAdapter } from './adapter';
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

export const bitFlag = createAdapter(
  bit,
  (data: number) => data !== 0,
  (data: boolean) => (data ? 1 : 0)
);
