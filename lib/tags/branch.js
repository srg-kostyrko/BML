const { Tag, tagWithParams } = require('./base');
const { functor, ensureTag } = require('../utils');

class Branch extends Tag {
  constructor(selector, cases, defaultTag) {
    super();
    this.selector = functor(selector);
    this.cases = cases;
    this.defaultTag = defaultTag;
  }

  _parse_(stream, context) {
    const caseKey = this.selector(context);
    let useCase = this.cases[caseKey];
    if (!useCase && this.defaultTag) {
      useCase = this.defaultTag;
    }
    if (useCase) {
      useCase = ensureTag(useCase);
      return useCase._parse_(stream, context);
    }
    return null;
  }

  _pack_(stream, data, context) {
    const caseKey = this.selector(context);
    let useCase = this.cases[caseKey];
    if (useCase) {
      useCase = ensureTag(useCase);
      useCase._pack_(stream, data, context);
    }
  }
}

module.exports = {
  branch: tagWithParams(Branch),
};
