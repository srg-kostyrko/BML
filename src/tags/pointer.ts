import {
  IContext,
  IStream,
  ContextGetterArg,
  ContextGetter,
} from '../contracts';
import { createContextGetter } from '../context';

import { Tag, createTag, unwrapTag, TagOrWrapper } from './tag';

class Pointer<T> extends Tag<T> {
  offset: ContextGetter<number>;
  subTag: Tag<T>;

  constructor(offset: ContextGetterArg<number>, subTag: TagOrWrapper<T>) {
    super();
    this.offset = createContextGetter(offset);
    this.subTag = unwrapTag(subTag);
  }

  parse(stream: IStream, context: IContext) {
    const offset = this.offset(context);
    const fallBack = stream.tell();
    stream.seek(offset);
    const result = this.subTag.parse(stream, context);
    stream.seek(fallBack);
    return result;
  }

  pack(stream: IStream, data: T, context: IContext) {
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
) {
  return createTag<T>(Pointer, offset, subTag);
}
