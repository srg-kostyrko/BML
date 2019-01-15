import {
  IContext,
  IStream,
  ContextGetter,
  ContextGetterArg,
} from '../contracts';
import { createContextGetter } from '../context';

import { Tag, createTag } from './tag';

class Computed<T> extends Tag<T> {
  compute: ContextGetter<T>;

  constructor(compute: ContextGetterArg<T>) {
    super();
    this.compute = createContextGetter(compute);
  }

  parse(stream: IStream, context: IContext) {
    const computedValue = this.compute(context);
    if (this.name) {
      context.set(this.name, computedValue);
    }
    return computedValue;
  }

  pack(stream: IStream, data: T, context: IContext) {
    this.parse(stream, context);
  }
}

export function computed<T>(compute: ContextGetterArg<T>) {
  return createTag<T>(Computed, compute);
}
