import {
  IContext,
  IStream,
  ContextGetter,
  ContextGetterArg,
} from '../contracts';
import { createContextGetter } from '../context';

import { Tag, createTag } from './tag';

// absolute move
class Seek extends Tag<null> {
  offset: ContextGetter<number>;

  constructor(offset: ContextGetterArg<number>) {
    super();
    this.offset = createContextGetter(offset);
  }

  parse(stream: IStream, context: IContext) {
    const offset = this.offset(context);
    stream.seek(offset);
    return null;
  }

  pack(stream: IStream, data: null, context: IContext) {
    this.parse(stream, context);
  }
}

export function seek(offset: ContextGetterArg<number>) {
  return createTag(Seek, offset);
}
