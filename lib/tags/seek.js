const { Tag, tagWithParams } = require('./base');
const { functor } = require('../utils');

class Seek extends Tag {
  constructor(offset) {
    super();
    this.offset = functor(offset);
  }

  _parse_(stream, context) {
    const offset = this.offset(context);
    stream.seek(offset);
    return null;
  }

  _pack_(stream, _data, context) {
    const offset = this.offset(context);
    stream.seek(offset);
  }

  _size_(_context) {
    return 0;
  }
}

module.exports = {
  seek: tagWithParams(Seek),
};
