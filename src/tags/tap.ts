import { ctxLogger, ContextFunction } from '../context';
import { Context, Stream } from '../contracts';

import { createTag, Tag, TagWrapperFunction, TagCreator } from './tag';

class Tap extends Tag<null> {
  private into: ContextFunction<unknown> | undefined;

  public constructor(into?: ContextFunction<unknown>) {
    super();
    if (into) {
      this.into = into;
    }
  }

  public tap(context: Context): void {
    const logger = ctxLogger(context);
    if (this.into) {
      logger.debug(
        `${this.into.property || this.into.name}: `,
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

export function tap(
  into?: ContextFunction<unknown>
): TagWrapperFunction<null> & TagCreator<null> {
  return createTag(Tap, into);
}
