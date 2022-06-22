import { ConstantError } from '../errors';
import { Context, Stream } from '../contracts';

import { Tag, createTag, unwrapTag, TagOrWrapper, TagProducer } from './tag';

class Constant<T> extends Tag<T> {
  private subTag: Tag<T>;
  private value: T;

  public constructor(subTag: TagOrWrapper<T>, value: T) {
    super();
    this.subTag = unwrapTag(subTag);
    this.value = value;
  }

  private checkValue(value: T): boolean {
    if (Array.isArray(this.value)) {
      if (!Array.isArray(value)) return false;
      if (value.length !== this.value.length) return false;
      return value.every(
        (el, index): boolean => el === (this.value as unknown as T[])[index]
      );
    }

    return value === this.value;
  }

  public parse(stream: Stream, context: Context): T {
    const value = this.subTag.parse(stream, context);
    if (!this.checkValue(value)) {
      throw new ConstantError(`expected ${this.value} but got ${value}`);
    }
    return value;
  }

  public pack(stream: Stream, _: T, context: Context): void {
    this.subTag.pack(stream, this.value, context);
  }
}

export function constant<T>(subTag: TagOrWrapper<T>, value: T): TagProducer<T> {
  return createTag<T, [TagOrWrapper<T>, T]>(Constant, subTag, value);
}
