import { Context, Stream } from '../contracts';
import { createContext } from '../context';

import { Tag, createTag, unwrapTag, TagOrWrapper, TagProducer } from './tag';

export type Predicate<T> = (
  context: Context,
  subData: T,
  index: number,
  data: T[]
) => boolean;

class Repeat<T> extends Tag<T[]> {
  private subTag: Tag<T>;
  private predicate: Predicate<T>;

  public constructor(subTag: TagOrWrapper<T>, predicate: Predicate<T>) {
    super();
    this.subTag = unwrapTag(subTag);
    this.predicate = predicate;
  }

  public parse(stream: Stream, context: Context): T[] {
    const listContext = createContext(context);
    const data = [];
    let index = 0;
    while (!stream.eof) {
      listContext.set('index', index);
      try {
        const position = stream.tell();
        const subData = this.subTag.parse(stream, listContext);
        if (!this.predicate(context, subData, index, data)) {
          stream.seek(position);
          break;
        }
        data.push(subData);
      } catch (err) {
        break;
      }
      index += 1;
    }
    return data;
  }

  public pack(stream: Stream, data: T[], context: Context): void {
    const listContext = createContext(context);
    const usedData = [];
    let index = 0;
    for (const subData of data) {
      listContext.set('index', index);
      if (!this.predicate(context, subData, index, usedData)) {
        break;
      }
      this.subTag.pack(stream, subData, listContext);
      usedData.push(subData);
      index += 1;
    }
  }
}

class RepeatUntil<T> extends Repeat<T> {
  public constructor(subTag: TagOrWrapper<T>, predicate: Predicate<T>) {
    super(subTag, (...args): boolean => !predicate(...args));
  }
}
class RepeatWhile<T> extends Repeat<T> {}

export function repeatUntil<T>(
  subTag: TagOrWrapper<T>,
  predicate: Predicate<T>
): TagProducer<T[]> {
  return createTag<T[], [TagOrWrapper<T>, Predicate<T>]>(
    RepeatUntil,
    subTag,
    predicate
  );
}
export function repeatWhile<T>(
  subTag: TagOrWrapper<T>,
  predicate: Predicate<T>
): TagProducer<T[]> {
  return createTag<T[], [TagOrWrapper<T>, Predicate<T>]>(
    RepeatWhile,
    subTag,
    predicate
  );
}
