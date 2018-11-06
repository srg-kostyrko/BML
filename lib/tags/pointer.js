const { Tag, tagWithParams } = require('./base');
const { functor, ensureTag } = require('../utils');

class Pointer extends Tag {
  constructor(offset, subTag) {
    super();
    this.offset = functor(offset);
    this.subTag = ensureTag(subTag);
  }

  _parse_(stream, context) {
    const offset = this.offset(context);
    const fallBack = stream.tell();
    stream.seek(offset);
    const result = this.subTag._parse_(stream, context);
    stream.seek(fallBack);
    return result;
  }

  _pack_(stream, data, context) {
    const offset = this.offset(context);
    const fallBack = stream.tell();
    stream.seek(offset);
    this.subTag._pack_(stream, data, context);
    stream.seek(fallBack);
  }

  _size_(_context) {
    return 0;
  }
}

module.exports = {
  pointer: tagWithParams(Pointer),
};
