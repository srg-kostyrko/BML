import { Context, Stream, ContextGetter, ContextGetterArg } from '../contracts';
import { createContextGetter } from '../context';

import { Tag, createTag, TagCreator, TagWrapperFunction } from './tag';

// relative move
class Skip extends Tag<null> {
  private offset: ContextGetter<number>;

  public constructor(offset: ContextGetterArg<number>) {
    super();
    this.offset = createContextGetter(offset);
  }

  public parse(stream: Stream, context: Context): null {
    const offset = this.offset(context);
    stream.skip(offset);
    return null;
  }

  public pack(stream: Stream, data: null, context: Context): void {
    this.parse(stream, context);
  }
}

export function skip(
  offset: ContextGetterArg<number>
): TagWrapperFunction<null> & TagCreator<null> {
  return createTag(Skip, offset);
}
