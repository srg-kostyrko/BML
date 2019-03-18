import { Context, Stream, ContextGetter, ContextGetterArg } from '../contracts';
import { createContextGetter } from '../context';

import { Tag, createTag, TagProducer } from './tag';

class Computed<T> extends Tag<T> {
  private compute: ContextGetter<T>;

  public constructor(compute: ContextGetterArg<T>) {
    super();
    this.compute = createContextGetter(compute);
  }

  public parse(_: Stream, context: Context): T {
    const computedValue = this.compute(context);
    if (this.name) {
      context.set(this.name, computedValue);
    }
    return computedValue;
  }

  public pack(stream: Stream, _: T, context: Context): void {
    this.parse(stream, context);
  }
}

export function computed<T>(compute: ContextGetterArg<T>): TagProducer<T> {
  return createTag<T, [ContextGetterArg<T>]>(Computed, compute);
}
