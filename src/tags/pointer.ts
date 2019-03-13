import { Context, Stream, ContextGetterArg, ContextGetter } from '../contracts';
import { createContextGetter } from '../context';

import {
  Tag,
  createTag,
  unwrapTag,
  TagOrWrapper,
  TagCreator,
  TagWrapperFunction,
} from './tag';

class Pointer<T> extends Tag<T> {
  private offset: ContextGetter<number>;
  private subTag: Tag<T>;

  public constructor(
    offset: ContextGetterArg<number>,
    subTag: TagOrWrapper<T>
  ) {
    super();
    this.offset = createContextGetter(offset);
    this.subTag = unwrapTag(subTag);
  }

  public parse(stream: Stream, context: Context): T {
    const offset = this.offset(context);
    const fallBack = stream.tell();
    stream.seek(offset);
    const result = this.subTag.parse(stream, context);
    stream.seek(fallBack);
    return result;
  }

  public pack(stream: Stream, data: T, context: Context): void {
    const offset = this.offset(context);
    const fallBack = stream.tell();
    stream.seek(offset);
    this.subTag.pack(stream, data, context);
    stream.seek(fallBack);
  }
}

export function pointer<T>(
  offset: ContextGetterArg<number>,
  subTag: TagOrWrapper<T>
): TagWrapperFunction<T> & TagCreator<T> {
  return createTag<T, [ContextGetterArg<number>, TagOrWrapper<T>]>(
    Pointer,
    offset,
    subTag
  );
}
