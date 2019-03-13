import { Adapter } from './adapter';
import { createTag } from './tag';
import { byte } from './primitives';

class Flag extends Adapter<number, boolean> {
  public constructor(subTag = byte) {
    super(subTag);
  }

  public decode(data: number): boolean {
    return data !== 0;
  }

  public encode(data: boolean): number {
    return data ? 1 : 0;
  }
}

export const flag = createTag(Flag);
