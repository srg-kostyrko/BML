const { Tag, tagWithParams } = require('./base');
const { ensureTag } = require('../utils');
const { ConstantError } = require('../errors');

class Constant extends Tag {
  constructor(subTag, value) {
    super();
    this.subTag = ensureTag(subTag);
    this.value = value;
  }

  checkValue(value) {
    if (Array.isArray(this.value)) {
      if (!Array.isArray(value)) return false;
      if (value.length !== this.value.length) return false;
      return value.every((el, index) => el === this.value[index]);
    }

    return value === this.value;
  }

  _parse_(stream, context) {
    const value = this.subTag._parse_(stream, context);
    if (!this.checkValue(value)) {
      throw new ConstantError(`expected ${this.value} but got ${value}`);
    }
    return value;
  }

  _pack_(stream, data, context) {
    this.subTag._pack_(stream, this.value, context);
  }
}

module.exports = {
  constant: tagWithParams(Constant),
};
