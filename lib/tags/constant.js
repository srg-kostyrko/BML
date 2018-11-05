const { Tag, tagWithParams } = require('./base');
const { ensureTag } = require('../utils');
const { ConstantError } = require('../errors');

class Constant extends Tag {
  constructor(subTag, value) {
    super();
    this.subTag = ensureTag(subTag);
    this.value = value;
  }

  _parse_(stream, context) {
    const parsedValue = this.subTag._parse_(stream, context);
    if (parsedValue !== this.value) {
      throw new ConstantError(`expected ${this.value} but got ${parsedValue}`);
    }
    return parsedValue;
  }

  _pack_(stream, data, context) {
    this.subTag._pack_(stream, this.value, context);
  }

  _size_(context) {
    return this.subTag._size_(context);
  }
}

module.exports = {
  constant: tagWithParams(Constant),
};
