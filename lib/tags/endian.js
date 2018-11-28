const { Tag, tagWithParams } = require('./base');
const { functor } = require('../utils');

class Endian extends Tag {
  constructor(endian) {
    super();
    this.endian = functor(endian);
  }

  _parse_(_stream, context) {
    const endian = this.endian(context);
    context.set('_endian_', endian);
    return endian;
  }

  _pack_(_stream, _data, context) {
    this._parse_(_stream, context);
  }
}

module.exports = {
  endian: tagWithParams(Endian),
};
