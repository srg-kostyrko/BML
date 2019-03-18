import { Context, Stream } from '../contracts';

import { Tag, createTag, unwrapTag, TagOrWrapper, TagProducer } from './tag';

class Peek<T> extends Tag<T> {
  private subTag: Tag<T>;

  public constructor(subTag: TagOrWrapper<T>) {
    super();
    this.subTag = unwrapTag(subTag);
  }

  public parse(stream: Stream, context: Context): T {
    const position = stream.tell();
    const value = this.subTag.parse(stream, context);
    stream.seek(position);
    return value;
  }

  public pack(): void {
    // noop
  }
}

export function peek<T>(subTag: TagOrWrapper<T>): TagProducer<T> {
  return createTag<T, [TagOrWrapper<T>]>(Peek, subTag);
}
