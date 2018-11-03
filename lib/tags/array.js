const { Tag, tagWithParams } = require('./base');
const { Context } = require('../Context');
const { functor, range, ensureTag } = require('../utils');

// Homogenous array of elements, similar to C# generic T[].
class ArrayTag extends Tag {
  constructor(tag, count) {
    super();
    this.tag = ensureTag(tag);
    this.count = functor(count);
  }

  _parse_(stream, context) {
    const count = this.count(context);
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
    const count = this.count(context);
    const listContext = new Context(context);
    for (const index of range(count)) {
      listContext.set('index', index);
      const subData = data[index];
      this.tag._pack_(stream, subData, listContext);
    }
  }

  _size_(context) {
    const listContext = new Context(context);
    return this.count(context) * this.tag._size_(listContext);
  }
}

module.exports = {
  array: tagWithParams(ArrayTag),
};
