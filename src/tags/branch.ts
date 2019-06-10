import { Context, Stream, ContextGetterArg, ContextGetter } from '../contracts';
import { createContextGetter } from '../context';

import {
  Tag,
  createTag,
  unwrapTag,
  TagOrWrapper,
  TagProducer,
  ExtractTagType,
} from './tag';
import { pass } from './pass';

export interface BranchCases {
  [key: string]: TagOrWrapper<unknown | null>;
}

class Branch<T extends BranchCases, D> extends Tag<
  ExtractTagType<T[keyof T]> | D | null
> {
  private selector: ContextGetter<string>;
  private cases: T;
  private defaultTag: TagOrWrapper<D | null>;

  public constructor(
    selector: ContextGetterArg<string>,
    cases: T,
    defaultTag: TagOrWrapper<D | null>
  ) {
    super();
    this.selector = createContextGetter(selector);
    this.cases = cases;
    this.defaultTag = defaultTag;
  }

  public parse(
    stream: Stream,
    context: Context
  ): ExtractTagType<T[keyof T]> | D | null {
    const caseKey = this.selector(context);
    let useCase = this.cases[caseKey];
    if (!useCase && this.defaultTag) {
      useCase = this.defaultTag;
    }
    if (useCase) {
      useCase = unwrapTag(useCase);
      return useCase.parse(stream, context) as
        | ExtractTagType<T[keyof T]>
        | D
        | null;
    }
    return null;
  }

  public pack(
    stream: Stream,
    data: ExtractTagType<T[keyof T]> | D | null,
    context: Context
  ): void {
    const caseKey = this.selector(context);
    let useCase = this.cases[caseKey];
    if (!useCase && this.defaultTag) {
      useCase = this.defaultTag;
    }
    if (useCase) {
      useCase = unwrapTag(useCase);
      useCase.pack(stream, data, context);
    }
  }
}

export function branch<T extends BranchCases, D = null>(
  selector: ContextGetterArg<string>,
  cases: T,
  defaultTag: TagOrWrapper<D | null> = pass
): TagProducer<ExtractTagType<T[keyof T]> | D | null> {
  return createTag<
    ExtractTagType<T[keyof T]> | D | null,
    [ContextGetterArg<string>, T, TagOrWrapper<D | null>]
  >(Branch, selector, cases, defaultTag);
}
