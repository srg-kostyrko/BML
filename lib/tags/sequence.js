const { CompositeTag, createTag } = require('./base');
const { Context } = require('../Context');

class Sequence extends CompositeTag {
  _parse_(stream, context) {
    const structContext = new Context(context);
    const data = [];
    for (const tag of this.subTags) {
      const subData = tag._parse_(stream, structContext);
      data.push(subData);
      if (tag.name) {
        structContext.set(tag.name, subData);
      }
    }
    return data;
  }

  _pack_(stream, data, context) {
    const structContext = new Context(context);
    for (const [index, tag] of this.subTags.entries()) {
      const subData = data[index];
      if (tag.name) {
        structContext.set(tag.name, subData);
      }
      tag._pack_(stream, subData, structContext);
    }
  }
}

module.exports = {
  sequence: createTag(Sequence),
};
