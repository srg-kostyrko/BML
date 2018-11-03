const { CompositeTag, tagWithParams } = require('./base');
const { Context } = require('../context');

class Struct extends CompositeTag {
  _parse_(stream, context) {
    const structContext = new Context(context);
    const data = {};
    for (const tag of this.subTags) {
      const subData = tag._parse_(stream, structContext);
      if (tag.name) {
        data[tag.name] = subData;
        structContext.set(tag.name, subData);
      }
    }
    return data;
  }

  _pack_(stream, data, context) {
    const structContext = new Context(context);
    for (const tag of this.subTags) {
      const subData = data[tag.name];
      structContext.set(tag.name, subData);
      tag._pack_(stream, subData, structContext);
    }
  }

  _size_(context) {
    const structContext = new Context(context);
    let total = 0;
    for (const tag of this.subTags) {
      total += tag._size_(structContext);
    }
    return total;
  }
}

module.exports = {
  struct: tagWithParams(Struct),
};
