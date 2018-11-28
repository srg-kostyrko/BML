const { Tag, tagWithParams } = require('./base');
const { ensureTag } = require('../utils');

class BitMask extends Tag {
  constructor(subTag, bitMap) {
    super();
    this.subTag = ensureTag(subTag);
    this.bitMap = bitMap;
  }

  _parse_(stream, context) {
    const parsedValue = this.subTag._parse_(stream, context);
    const result = {};
    for (const key of Object.keys(this.bitMap)) {
      result[key] = Boolean(parsedValue & this.bitMap[key]);
    }
    return result;
  }

  _pack_(stream, data, context) {
    let value = 0;
    for (const key of Object.keys(this.bitMap)) {
      if (data[key]) {
        value |= this.bitMap[key];
      }
    }
    this.subTag._pack_(stream, value, context);
  }
}

module.exports = {
  bit_mask: tagWithParams(BitMask),
};
