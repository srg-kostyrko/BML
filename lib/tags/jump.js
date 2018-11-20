const { Tag, tagWithParams } = require('./base');
const { functor } = require('../utils');

// absolute move
class Jump extends Tag {
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
    this._parse_(stream, context);
  }
}

module.exports = {
  jump: tagWithParams(Jump),
};
