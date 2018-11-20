const { Tag, tagWithParams } = require('./base');
const { functor } = require('../utils');

// relative move
class Seek extends Tag {
  constructor(offset) {
    super();
    this.offset = functor(offset);
  }

  _parse_(stream, context) {
    const offset = this.offset(context);
    const streamOffset = stream.tell();
    stream.seek(streamOffset + offset);
    return null;
  }

  _pack_(stream, _data, context) {
    this._parse_(stream, context);
  }
}

module.exports = {
  seek: tagWithParams(Seek),
};
