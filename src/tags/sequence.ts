import { Context } from '../context';
import { IContext, IStream } from '../contracts';

import { Tag, createTag, TagOrWrapper, unwrapTag } from './tag';

class Sequence<T> extends Tag<T[]> {
  subTags: Tag<T>[];

  constructor(...subTags: TagOrWrapper<T>[]) {
    super();
    this.subTags = subTags.map(unwrapTag);
  }

  parse(stream: IStream, context: IContext) {
    const sequenceContext = new Context(context);
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

  pack(stream: IStream, data: T[], context: IContext) {
    const sequenceContext = new Context(context);
    for (const [index, tag] of this.subTags.entries()) {
      const subData = data[index];
      if (tag.name) {
        sequenceContext.set(tag.name, subData);
      }
      tag.pack(stream, subData, sequenceContext);
    }
  }
}

export function sequence<T>(...subTags: TagOrWrapper<T>[]) {
  return createTag<T[]>(Sequence, ...subTags);
}
