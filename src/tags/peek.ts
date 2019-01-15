import { IContext, IStream } from '../contracts';

import { Tag, createTag, unwrapTag, TagOrWrapper } from './tag';

class Peek<T> extends Tag<T> {
  subTag: Tag<T>;

  constructor(subTag: TagOrWrapper<T>) {
    super();
    this.subTag = unwrapTag(subTag);
  }

  parse(stream: IStream, context: IContext) {
    const position = stream.tell();
    const value = this.subTag.parse(stream, context);
    stream.seek(position);
    return value;
  }

  pack(stream: IStream, data: T, context: IContext) {
    // noop
  }
}

export function peek<T>(subTag: TagOrWrapper<T>) {
  return createTag(Peek, subTag);
}
