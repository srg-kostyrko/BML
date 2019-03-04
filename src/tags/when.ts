import {
  IContext,
  IStream,
  ContextGetter,
  ContextGetterArg,
} from '../contracts';
import { createContextGetter } from '../context';

import { Tag, createTag, unwrapTag, TagOrWrapper } from './tag';
import { pass } from './pass';

class WhenElse<When, Else> extends Tag<When | Else> {
  predicate: ContextGetter<boolean>;
  whenTag: Tag<When>;
  elseTag: Tag<Else>;

  constructor(
    predicate: ContextGetterArg<boolean>,
    whenTag: TagOrWrapper<When>,
    elseTag: TagOrWrapper<Else>
  ) {
    super();
    this.predicate = createContextGetter(predicate);
    this.whenTag = unwrapTag(whenTag);
    this.elseTag = unwrapTag(elseTag);
  }

  parse(stream: IStream, context: IContext) {
    const predicateResult = this.predicate(context);
    if (predicateResult) {
      return this.whenTag.parse(stream, context);
    }
    return this.elseTag.parse(stream, context);
  }

  pack(stream: IStream, data: When | Else, context: IContext) {
    const predicateResult = this.predicate(context);
    if (predicateResult) {
      this.whenTag.pack(stream, data as When, context);
    }
    if (this.elseTag) {
      this.elseTag.pack(stream, data as Else, context);
    }
  }
}

export function when<When, Else>(
  predicate: ContextGetterArg<boolean>,
  whenTag: TagOrWrapper<When>,
  elseTag: TagOrWrapper<Else | null> = pass
) {
  return createTag<When | Else>(
    WhenElse as { new (...args: any[]): Tag<When | Else> },
    predicate,
    whenTag,
    elseTag
  );
}
