import { IContext, IStream } from '../contracts';

import { Tag, createTag } from './tag';

class Pass extends Tag<null> {
  parse(stream: IStream, context: IContext) {
    // noop
    return null;
  }

  pack(stream: IStream, data: null, context: IContext) {
    // noop
  }
}

export const pass = createTag(Pass);
