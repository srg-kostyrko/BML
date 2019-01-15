import { Context, createContextGetter } from '../context';
import {
  IContext,
  IStream,
  ContextGetter,
  ContextGetterArg,
} from '../contracts';

import { Tag, createTag, unwrapTag, TagOrWrapper } from './tag';
import { byte } from './primitives';

function range(size: number) {
  return Array.from({ length: size }, (_, i) => i);
}

// Homogenous array of elements, similar to C# generic T[].
class ArrayTag<T> extends Tag<T[]> {
  tag: Tag<T>;
  size: ContextGetter<number>;

  constructor(tag: TagOrWrapper<T>, size: ContextGetterArg<number>) {
    super();
    this.tag = unwrapTag(tag);
    this.size = createContextGetter(size);
  }

  parse(stream: IStream, context: IContext) {
    const size = this.size(context);
    const listContext = new Context(context);
    const data = [];
    for (const index of range(size)) {
      listContext.set('index', index);
      const subData = this.tag.parse(stream, listContext);
      data.push(subData);
    }
    return data;
  }

  pack(stream: IStream, data: T[], context: IContext) {
    const size = this.size(context);
    const listContext = new Context(context);
    for (const index of range(size)) {
      listContext.set('index', index);
      const subData = data[index];
      this.tag.pack(stream, subData, listContext);
    }
  }
}

class GreedyArray<T> extends Tag<T[]> {
  tag: Tag<T>;

  constructor(tag: TagOrWrapper<T>) {
    super();
    this.tag = unwrapTag(tag);
  }

  parse(stream: IStream, context: IContext) {
    const listContext = new Context(context);
    const data = [];
    let index = 0;
    while (!stream.eof) {
      listContext.set('index', index);
      try {
        const subData = this.tag.parse(stream, listContext);
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
    let index = 0;
    for (const subData of data) {
      listContext.set('index', index);
      this.tag.pack(stream, subData, listContext);
      index += 1;
    }
  }
}

export function array<T>(
  subTag: TagOrWrapper<T>,
  size: ContextGetterArg<number>
) {
  return createTag<T[]>(ArrayTag, subTag, size);
}
export function greedyArray<T>(subTag: TagOrWrapper<T>) {
  return createTag<T[]>(GreedyArray, subTag);
}

export function bytes(count: ContextGetterArg<number>) {
  return array<number>(byte, count);
}

export const greedyBytes = greedyArray<number>(byte);
