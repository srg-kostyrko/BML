import { Context, Stream, ContextGetter, ContextGetterArg } from '../contracts';
import { createContextGetter } from '../context';

import {
  Tag,
  unwrapTag,
  TagOrWrapper,
  createTag,
  TagCreator,
  TagWrapperFunction,
} from './tag';

class Aligned<T> extends Tag<T> {
  private subTag: Tag<T>;
  private size: ContextGetter<number>;

  public constructor(subTag: TagOrWrapper<T>, size: ContextGetterArg<number>) {
    super();
    this.subTag = unwrapTag(subTag);
    this.size = createContextGetter(size);
  }

  public parse(stream: Stream, context: Context): T {
    const startPosition = stream.tell();
    const value = this.subTag.parse(stream, context);
    const endPosition = stream.tell();
    const modulus = this.size(context);
    const pad = (endPosition - startPosition) % modulus;
    stream.seek(endPosition + pad);
    return value;
  }

  public pack(stream: Stream, data: T, context: Context): void {
    const startPosition = stream.tell();
    this.subTag.pack(stream, data, context);
    const endPosition = stream.tell();
    const modulus = this.size(context);
    const pad = (endPosition - startPosition) % modulus;
    stream.seek(endPosition + pad);
  }
}

export function aligned<T>(
  subTag: TagOrWrapper<T>,
  size: ContextGetterArg<number>
): TagWrapperFunction<T> & TagCreator<T> {
  return createTag<T, [TagOrWrapper<T>, ContextGetterArg<number>]>(
    Aligned,
    subTag,
    size
  );
}
