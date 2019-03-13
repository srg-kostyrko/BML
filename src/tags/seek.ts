import { Context, Stream, ContextGetter, ContextGetterArg } from '../contracts';
import { createContextGetter } from '../context';

import { Tag, createTag, TagWrapperFunction, TagCreator } from './tag';

// absolute move
class Seek extends Tag<null> {
  private offset: ContextGetter<number>;

  public constructor(offset: ContextGetterArg<number>) {
    super();
    this.offset = createContextGetter(offset);
  }

  public parse(stream: Stream, context: Context): null {
    const offset = this.offset(context);
    stream.seek(offset);
    return null;
  }

  public pack(stream: Stream, data: null, context: Context): void {
    this.parse(stream, context);
  }
}

export function seek(
  offset: ContextGetterArg<number>
): TagWrapperFunction<null> & TagCreator<null> {
  return createTag(Seek, offset);
}
