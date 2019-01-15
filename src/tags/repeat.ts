import { IContext, IStream } from '../contracts';
import { Context } from '../context';

import { Tag, createTag, unwrapTag, TagOrWrapper } from './tag';

export type Predicate<T> = (
  context: IContext,
  subData: T,
  index: number,
  data: T[]
) => boolean;

class Repeat<T> extends Tag<T[]> {
  subTag: Tag<T>;
  predicate: Predicate<T>;

  constructor(subTag: TagOrWrapper<T>, predicate: Predicate<T>) {
    super();
    this.subTag = unwrapTag(subTag);
    this.predicate = predicate;
  }

  parse(stream: IStream, context: IContext) {
    const listContext = new Context(context);
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

  pack(stream: IStream, data: T[], context: IContext) {
    const listContext = new Context(context);
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
  constructor(subTag: TagOrWrapper<T>, predicate: Predicate<T>) {
    super(subTag, (...args) => !predicate(...args));
  }
}
class RepeatWhile<T> extends Repeat<T> {}

export function repeatUntil<T>(
  subTag: TagOrWrapper<T>,
  predicate: Predicate<T>
) {
  return createTag<T[]>(RepeatUntil, subTag, predicate);
}
export function repeatWhile<T>(
  subTag: TagOrWrapper<T>,
  predicate: Predicate<T>
) {
  return createTag<T[]>(RepeatWhile, subTag, predicate);
}
