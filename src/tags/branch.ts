import { Context, Stream, ContextGetterArg, ContextGetter } from '../contracts';
import { createContextGetter } from '../context';

import {
  Tag,
  createTag,
  unwrapTag,
  TagOrWrapper,
  TagCreator,
  TagWrapperFunction,
} from './tag';
import { pass } from './pass';

export interface BranchCases<T> {
  [key: string]: TagOrWrapper<T | null>;
}

class Branch<T> extends Tag<T | null> {
  private selector: ContextGetter<string>;
  private cases: BranchCases<T>;
  private defaultTag: TagOrWrapper<T | null>;

  public constructor(
    selector: ContextGetterArg<string>,
    cases: BranchCases<T>,
    defaultTag: TagOrWrapper<T | null>
  ) {
    super();
    this.selector = createContextGetter(selector);
    this.cases = cases;
    this.defaultTag = defaultTag;
  }

  public parse(stream: Stream, context: Context): T | null {
    const caseKey = this.selector(context);
    let useCase = this.cases[caseKey];
    if (!useCase && this.defaultTag) {
      useCase = this.defaultTag;
    }
    if (useCase) {
      useCase = unwrapTag(useCase);
      return useCase.parse(stream, context);
    }
    return null;
  }

  public pack(stream: Stream, data: T, context: Context): void {
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

export function branch<T>(
  selector: ContextGetterArg<string>,
  cases: BranchCases<T>,
  defaultTag: TagOrWrapper<T | null> = pass
): TagWrapperFunction<T | null> & TagCreator<T | null> {
  return createTag<
    T | null,
    [ContextGetterArg<string>, BranchCases<T>, TagOrWrapper<T | null>]
  >(Branch, selector, cases, defaultTag);
}
