import {
  IContext,
  IStream,
  ContextGetterArg,
  ContextGetter,
} from '../contracts';
import { createContextGetter } from '../context';

import { Tag, createTag, unwrapTag, TagOrWrapper } from './tag';

export type BranchCases<T> = {
  [key: string]: TagOrWrapper<T>;
};

class Branch<T> extends Tag<T | null> {
  selector: ContextGetter<string>;
  cases: BranchCases<T>;
  defaultTag: TagOrWrapper<T> | undefined;
  constructor(
    selector: ContextGetterArg<string>,
    cases: BranchCases<T>,
    defaultTag?: TagOrWrapper<T>
  ) {
    super();
    this.selector = createContextGetter(selector);
    this.cases = cases;
    this.defaultTag = defaultTag;
  }

  parse(stream: IStream, context: IContext) {
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

  pack(stream: IStream, data: T, context: IContext) {
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
  defaultTag?: TagOrWrapper<T>
) {
  return createTag<T | null>(Branch, selector, cases, defaultTag);
}
