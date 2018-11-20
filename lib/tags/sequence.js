const { CompositeTag, tagWithParams } = require('./base');
const { Context } = require('../context');

class Sequence extends CompositeTag {
  _parse_(stream, context) {
    const sequenceContext = new Context(context);
    const data = [];
    for (const tag of this.subTags) {
      const subData = tag._parse_(stream, sequenceContext);
      data.push(subData);
      if (tag.name) {
        sequenceContext.set(tag.name, subData);
      }
    }
    return data;
  }

  _pack_(stream, data, context) {
    const sequenceContext = new Context(context);
    for (const [index, tag] of this.subTags.entries()) {
      const subData = data[index];
      if (tag.name) {
        sequenceContext.set(tag.name, subData);
      }
      tag._pack_(stream, subData, sequenceContext);
    }
  }
}

module.exports = {
  sequence: tagWithParams(Sequence),
};
