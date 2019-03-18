import { Context, Stream, ContextGetter, ContextGetterArg } from '../contracts';
import { createContextGetter } from '../context';

import { Tag, createTag, unwrapTag, TagOrWrapper, TagProducer } from './tag';
import { pass } from './pass';

class WhenElse<When, Else> extends Tag<When | Else> {
  private predicate: ContextGetter<boolean>;
  private whenTag: Tag<When>;
  private elseTag: Tag<Else>;

  public constructor(
    predicate: ContextGetterArg<boolean>,
    whenTag: TagOrWrapper<When>,
    elseTag: TagOrWrapper<Else>
  ) {
    super();
    this.predicate = createContextGetter(predicate);
    this.whenTag = unwrapTag(whenTag);
    this.elseTag = unwrapTag(elseTag);
  }

  public parse(stream: Stream, context: Context): When | Else {
    const predicateResult = this.predicate(context);
    if (predicateResult) {
      return this.whenTag.parse(stream, context);
    }
    return this.elseTag.parse(stream, context);
  }

  public pack(stream: Stream, data: When | Else, context: Context): void {
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
): TagProducer<When | Else> {
  return createTag<
    When | Else,
    [ContextGetterArg<boolean>, TagOrWrapper<When>, TagOrWrapper<Else | null>]
  >(
    WhenElse as {
      new (
        ...args: [
          ContextGetterArg<boolean>,
          TagOrWrapper<When>,
          TagOrWrapper<Else | null>
        ]
      ): Tag<When | Else>;
    },
    predicate,
    whenTag,
    elseTag
  );
}
