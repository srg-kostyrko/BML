const { Tag, tagWithParams } = require('./base');
const { ensureTag } = require('../utils');

class Peek extends Tag {
  constructor(subTag) {
    super();
    this.subTag = ensureTag(subTag);
  }

  _parse_(stream, context) {
    const position = stream.tell();
    const value = this.subTag._parse_(stream, context);
    stream.seek(position);
    return value;
  }

  _pack_(_stream, _data, _context) {
    // noop
  }
}

module.exports = {
  peek: tagWithParams(Peek),
};
