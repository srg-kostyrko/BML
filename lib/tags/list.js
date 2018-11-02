const { BaseTag, createTag } = require('./base');
const { Context } = require('../Context');
const { functor, range, ensureTag } = require('../utils');

// Homogenous array of elements, similar to C# generic T[].
class List extends BaseTag {
  constructor(tag, size) {
    super();
    this.tag = ensureTag(tag);
    this.size = functor(size);
  }

  _parse_(stream, context) {
    const count = this.size(context);
    const listContext = new Context(context);
    const data = [];
    for (const index of range(count)) {
      listContext.set('index', index);
      const subData = this.tag._parse_(stream, listContext);
      data.push(subData);
    }
    return data;
  }

  _pack_(stream, data, context) {
    const count = this.size(context);
    const listContext = new Context(context);
    for (const index of range(count)) {
      listContext.set('index', index);
      const subData = data[index];
      this.tag._pack_(stream, subData, listContext);
    }
  }
}

module.exports = {
  list: createTag(List),
};
