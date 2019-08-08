import { Tag, createTag, TagOrWrapper, unwrapTag, TagProducer } from './tag';
import { Context, Stream } from '../contracts';

export type TagBinder<T> = (context: Context) => TagOrWrapper<T>;

class LazyBound<T> extends Tag<T> {
  public constructor(private subTagCreator: TagBinder<T>) {
    super();
  }

  private getSubTag(context: Context): Tag<T> {
    return unwrapTag(this.subTagCreator(context));
  }

  public parse(stream: Stream, context: Context): T {
    const subTag = this.getSubTag(context);
    return subTag.parse(stream, context);
  }

  public pack(stream: Stream, data: T, context: Context): void {
    const subTag = this.getSubTag(context);
    subTag.pack(stream, data, context);
  }
}

export function lazyBound<T>(subTagCreator: TagBinder<T>): TagProducer<T> {
  return createTag<T, [TagBinder<T>]>(LazyBound, subTagCreator);
}
