import { ctxLogger, IContextFunction } from '../context';
import { IContext, IStream } from '../contracts';

import { createTag, Tag } from './tag';

class Tap extends Tag<null> {
  into: IContextFunction<any> | undefined;
  constructor(into?: IContextFunction<any>) {
    super();
    if (into) {
      this.into = into;
    }
  }

  tap(context: IContext) {
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

  parse(stream: IStream, context: IContext) {
    this.tap(context);
    return null;
  }

  pack(stream: IStream, data: null, context: IContext) {
    this.tap(context);
  }
}

export function tap(into?: IContextFunction<any>) {
  return createTag(Tap, into);
}
