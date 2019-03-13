import { createContextGetter, createContext } from '../context';
import { Context, Stream, ContextGetter, ContextGetterArg } from '../contracts';

import {
  Tag,
  createTag,
  unwrapTag,
  TagOrWrapper,
  TagWrapperFunction,
  TagCreator,
} from './tag';
import { byte } from './primitives';

function range(size: number): number[] {
  return Array.from({ length: size }, (_, i) => i);
}

// Homogenous array of elements, similar to C# generic T[].
class ArrayTag<T> extends Tag<T[]> {
  private tag: Tag<T>;
  private size: ContextGetter<number>;

  public constructor(tag: TagOrWrapper<T>, size: ContextGetterArg<number>) {
    super();
    this.tag = unwrapTag(tag);
    this.size = createContextGetter(size);
  }

  public parse(stream: Stream, context: Context): T[] {
    const size = this.size(context);
    const listContext = createContext(context);
    const data = [];
    for (const index of range(size)) {
      listContext.set('index', index);
      const subData = this.tag.parse(stream, listContext);
      data.push(subData);
    }
    return data;
  }

  public pack(stream: Stream, data: T[], context: Context): void {
    const size = this.size(context);
    const listContext = createContext(context);
    for (const index of range(size)) {
      listContext.set('index', index);
      const subData = data[index];
      this.tag.pack(stream, subData, listContext);
    }
  }
}

class GreedyArray<T> extends Tag<T[]> {
  private tag: Tag<T>;

  public constructor(tag: TagOrWrapper<T>) {
    super();
    this.tag = unwrapTag(tag);
  }

  public parse(stream: Stream, context: Context): T[] {
    const listContext = createContext(context);
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

  public pack(stream: Stream, data: T[], context: Context): void {
    const listContext = createContext(context);
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
): TagWrapperFunction<T[]> & TagCreator<T[]> {
  return createTag<T[], [TagOrWrapper<T>, ContextGetterArg<number>]>(
    ArrayTag,
    subTag,
    size
  );
}
export function greedyArray<T>(
  subTag: TagOrWrapper<T>
): TagWrapperFunction<T[]> & TagCreator<T[]> {
  return createTag<T[], [TagOrWrapper<T>]>(GreedyArray, subTag);
}

export function bytes(
  count: ContextGetterArg<number>
): TagWrapperFunction<number[]> & TagCreator<number[]> {
  return array<number>(byte, count);
}

export const greedyBytes = greedyArray<number>(byte);
