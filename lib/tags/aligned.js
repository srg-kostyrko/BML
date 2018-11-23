const { Tag, tagWithParams } = require('./base');
const { ensureTag, functor } = require('../utils');

class Aligned extends Tag {
  constructor(subTag, modulus) {
    super();
    this.subTag = ensureTag(subTag);
    this.modulus = functor(modulus);
  }

  _parse_(stream, context) {
    const start_position = stream.tell();
    const value = this.subTag._parse_(stream, context);
    const end_position = stream.tell();
    const modulus = this.modulus(context);
    const pad = (end_position - start_position) % modulus;
    stream.seek(end_position + pad);
    return value;
  }

  _pack_(stream, data, context) {
    const start_position = stream.tell();
    this.subTag._pack_(stream, data, context);
    const end_position = stream.tell();
    const modulus = this.modulus(context);
    const pad = (end_position - start_position) % modulus;
    stream.seek(end_position + pad);
  }
}

module.exports = {
  aligned: tagWithParams(Aligned),
};
