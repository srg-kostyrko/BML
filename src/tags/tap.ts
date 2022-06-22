import { ctxLogger, ContextFunction, createContextGetter } from '../context';
import { Context, Stream, ContextGetter, ContextGetterArg } from '../contracts';

import { createTag, Tag, TagProducer } from './tag';

class Tap extends Tag<null> {
  private into: ContextGetter<unknown> | undefined;

  public constructor(into?: ContextGetterArg<unknown>) {
    super();
    if (into) {
      this.into = createContextGetter(into);
    }
  }

  public tap(context: Context): void {
    const logger = ctxLogger(context);
    if (this.into) {
      logger.debug(
        `${
          (this.into as ContextFunction<unknown>).property || this.into.name
        }: `,
        this.into(context)
      );
    } else {
      logger.debug(context.toJSON());
    }
  }

  public parse(stream: Stream, context: Context): null {
    this.tap(context);
    return null;
  }

  public pack(stream: Stream, data: null, context: Context): void {
    this.tap(context);
  }
}

export function tap(into?: ContextGetterArg<unknown>): TagProducer<null> {
  return createTag(Tap, into);
}
