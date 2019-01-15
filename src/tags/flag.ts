import { IContext } from '../contracts';

import { Adapter } from './adapter';
import { createTag } from './tag';
import { byte } from './primitives';

class Flag extends Adapter<number, boolean> {
  constructor(subTag = byte) {
    super(subTag);
  }

  decode(data: number, context: IContext) {
    return data !== 0;
  }

  encode(data: boolean, context: IContext) {
    return data ? 1 : 0;
  }
}

export const flag = createTag(Flag);
