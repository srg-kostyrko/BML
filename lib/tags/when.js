const { Tag, tagWithParams } = require('./base');
const { functor, ensureTag } = require('../utils');

class WhenElse extends Tag {
  constructor(predicate, whenTag, elseTag) {
    super();
    this.predicate = functor(predicate);
    this.whenTag = ensureTag(whenTag);
    if (elseTag) {
      this.elseTag = ensureTag(elseTag);
    }
  }

  _parse_(stream, context) {
    const predicateResult = this.predicate(context);
    if (predicateResult) {
      return this.whenTag._parse_(stream, context);
    }
    if (this.elseTag) {
      return this.elseTag._parse_(stream, context);
    }
    return null;
  }

  _pack_(stream, data, context) {
    const predicateResult = this.predicate(context);
    if (predicateResult) {
      this.whenTag._pack_(stream, data, context);
    }
    if (this.elseTag) {
      this.elseTag._pack_(stream, data, context);
    }
  }

  _size_(context) {
    const predicateResult = this.predicate(context);
    if (predicateResult) {
      return this.whenTag._size_(context);
    }
    if (this.elseTag) {
      return this.elseTag._size_(context);
    }
    return 0;
  }
}

const when = tagWithParams(WhenElse);

module.exports = {
  when,
};
