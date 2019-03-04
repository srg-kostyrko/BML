import { IContext, IStream } from '../contracts';
import { Context } from '../context';

import { Tag, createTag, unwrapTag, TagOrWrapper } from './tag';

export type StructOutput = {
  [key: string]: unknown;
};

class Struct<T extends StructOutput> extends Tag<T> {
  subTags: Tag<unknown>[];

  constructor(...subTags: TagOrWrapper<unknown>[]) {
    super();
    this.subTags = subTags.map(unwrapTag);
  }

  parse(stream: IStream, context: IContext): T {
    const structContext = new Context(context);
    const data = ({} as unknown) as T;
    for (const tag of this.subTags) {
      const subData = tag.parse(stream, structContext);
      if (tag.name) {
        data[tag.name] = subData;
        structContext.set(tag.name, subData);
      }
    }
    return data;
  }

  pack(stream: IStream, data: T, context: IContext) {
    const structContext = new Context(context);
    for (const tag of this.subTags) {
      if (tag.name) {
        const subData = data[tag.name];
        structContext.set(tag.name, subData);
        tag.pack(stream, subData, structContext);
      }
    }
  }
}

export function struct<T extends StructOutput>(
  ...subTags: TagOrWrapper<unknown>[]
) {
  return createTag<T>(Struct, ...subTags);
}
