import {
  IContext,
  IStream,
  ContextGetter,
  ContextGetterArg,
} from '../contracts';
import { createContextGetter } from '../context';

import { Tag, createTag, unwrapTag, TagOrWrapper } from './tag';

class WhenElse<T> extends Tag<T | null> {
  predicate: ContextGetter<boolean>;
  whenTag: Tag<T>;
  elseTag: Tag<T> | undefined;

  constructor(
    predicate: ContextGetterArg<boolean>,
    whenTag: TagOrWrapper<T>,
    elseTag?: TagOrWrapper<T>
  ) {
    super();
    this.predicate = createContextGetter(predicate);
    this.whenTag = unwrapTag(whenTag);
    if (elseTag) {
      this.elseTag = unwrapTag(elseTag);
    }
  }

  parse(stream: IStream, context: IContext) {
    const predicateResult = this.predicate(context);
    if (predicateResult) {
      return this.whenTag.parse(stream, context);
    }
    if (this.elseTag) {
      return this.elseTag.parse(stream, context);
    }
    return null;
  }

  pack(stream: IStream, data: T, context: IContext) {
    const predicateResult = this.predicate(context);
    if (predicateResult) {
      this.whenTag.pack(stream, data, context);
    }
    if (this.elseTag) {
      this.elseTag.pack(stream, data, context);
    }
  }
}

export function when<T>(
  predicate: ContextGetterArg<boolean>,
  whenTag: TagOrWrapper<T>,
  elseTag?: TagOrWrapper<T>
) {
  return createTag<T | null>(WhenElse, predicate, whenTag, elseTag);
}
