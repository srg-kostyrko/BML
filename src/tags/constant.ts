import { ConstantError } from '../errors';
import { IContext, IStream } from '../contracts';

import { Tag, createTag, unwrapTag, TagOrWrapper } from './tag';

class Constant<T> extends Tag<T> {
  subTag: Tag<T>;
  value: T;

  constructor(subTag: TagOrWrapper<T>, value: T) {
    super();
    this.subTag = unwrapTag(subTag);
    this.value = value;
  }

  checkValue(value: T) {
    if (Array.isArray(this.value)) {
      if (!Array.isArray(value)) return false;
      if (value.length !== this.value.length) return false;
      return value.every(
        (el, index) => el === ((this.value as unknown) as any[])[index]
      );
    }

    return value === this.value;
  }

  parse(stream: IStream, context: IContext) {
    const value = this.subTag.parse(stream, context);
    if (!this.checkValue(value)) {
      throw new ConstantError(`expected ${this.value} but got ${value}`);
    }
    return value;
  }

  pack(stream: IStream, data: T, context: IContext) {
    this.subTag.pack(stream, this.value, context);
  }
}

export function constant<T>(subTag: TagOrWrapper<T>, value: T) {
  return createTag<T>(Constant, subTag, value);
}
