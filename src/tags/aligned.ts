import {
  IContext,
  IStream,
  ContextGetter,
  ContextGetterArg,
} from '../contracts';
import { createContextGetter } from '../context';

import { Tag, unwrapTag, TagOrWrapper, createTag } from './tag';

class Aligned<T> extends Tag<T> {
  subTag: Tag<T>;
  size: ContextGetter<number>;

  constructor(subTag: TagOrWrapper<T>, size: ContextGetterArg<number>) {
    super();
    this.subTag = unwrapTag(subTag);
    this.size = createContextGetter(size);
  }

  parse(stream: IStream, context: IContext) {
    const startPosition = stream.tell();
    const value = this.subTag.parse(stream, context);
    const endPosition = stream.tell();
    const modulus = this.size(context);
    const pad = (endPosition - startPosition) % modulus;
    stream.seek(endPosition + pad);
    return value;
  }

  pack(stream: IStream, data: T, context: IContext) {
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
) {
  return createTag<T>(Aligned, subTag, size);
}
