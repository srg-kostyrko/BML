import { Context, Stream } from '../contracts';
import { createContext } from '../context';

import { Tag, createTag, unwrapTag, TagOrWrapper, TagProducer } from './tag';

export interface StructOutput {
  [key: string]: unknown;
}

class Struct<T extends StructOutput> extends Tag<T> {
  private subTags: Tag<unknown>[];

  public constructor(...subTags: TagOrWrapper<unknown>[]) {
    super();
    this.subTags = subTags.map(unwrapTag);
  }

  public parse(stream: Stream, context: Context): T {
    const structContext = createContext(context);
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

  public pack(stream: Stream, data: T, context: Context): void {
    const structContext = createContext(context);
    for (const tag of this.subTags) {
      if (tag.name) {
        const subData = data[tag.name];
        structContext.set(tag.name, subData);
        tag.pack(stream, subData, structContext);
      } else {
        tag.pack(stream, null, structContext);
      }
    }
  }
}

export function struct<T extends StructOutput>(
  ...subTags: TagOrWrapper<unknown>[]
): TagProducer<T> {
  return createTag<T, TagOrWrapper<unknown>[]>(Struct, ...subTags);
}
