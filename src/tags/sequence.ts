import { createContext } from '../context';
import { Context as IContext, Stream } from '../contracts';

import { Tag, createTag, TagOrWrapper, unwrapTag, TagProducer } from './tag';

class Sequence<T> extends Tag<T[]> {
  private subTags: Tag<T>[];

  public constructor(...subTags: TagOrWrapper<T>[]) {
    super();
    this.subTags = subTags.map(unwrapTag);
  }

  public parse(stream: Stream, context: IContext): T[] {
    const sequenceContext = createContext(context);
    const data = [];
    for (const tag of this.subTags) {
      const subData = tag.parse(stream, sequenceContext);
      data.push(subData);
      if (tag.name) {
        sequenceContext.set(tag.name, subData);
      }
    }
    return data;
  }

  public pack(stream: Stream, data: T[], context: IContext): void {
    const sequenceContext = createContext(context);
    for (const [index, tag] of this.subTags.entries()) {
      const subData = data[index];
      if (tag.name) {
        sequenceContext.set(tag.name, subData);
      }
      tag.pack(stream, subData, sequenceContext);
    }
  }
}

export function sequence<T>(...subTags: TagOrWrapper<T>[]): TagProducer<T[]> {
  return createTag<T[], TagOrWrapper<T>[]>(Sequence, ...subTags);
}
