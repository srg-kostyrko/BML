const { Tag, tagWithParams } = require('./base');
const { byte } = require('./primitives');
const { Context } = require('../context');
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
}

class GreedyArray extends Tag {
  constructor(tag) {
    super();
    this.tag = ensureTag(tag);
  }

  _parse_(stream, context) {
    const listContext = new Context(context);
    const data = [];
    let index = 0;
    while (!stream.eof) {
      listContext.set('index', index);
      try {
        const subData = this.tag._parse_(stream, listContext);
        data.push(subData);
      } catch (err) {
        break;
      }
      index += 1;
    }
    return data;
  }

  _pack_(stream, data, context) {
    const listContext = new Context(context);
    let index = 0;
    for (const subData of data) {
      listContext.set('index', index);
      this.tag._pack_(stream, subData, listContext);
      index += 1;
    }
  }
}

const array = tagWithParams(ArrayTag);
const greedy_array = tagWithParams(GreedyArray);

module.exports = {
  array,
  greedy_array,
  bytes: function bytes(count) {
    return array(byte, count);
  },
  greedy_bytes: greedy_array(byte),
};
