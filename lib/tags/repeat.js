const { Tag, tagWithParams } = require('./base');
const { ensureTag, functor } = require('../utils');
const { Context } = require('../context');

class Repeat extends Tag {
  constructor(subTag, predicate) {
    super();
    this.subTag = ensureTag(subTag);
    this.predicate = functor(predicate);
  }

  _parse_(stream, context) {
    const listContext = new Context(context);
    const data = [];
    let index = 0;
    while (!stream.eof) {
      listContext.set('index', index);
      try {
        const position = stream.tell();
        const subData = this.subTag._parse_(stream, listContext);
        if (!this.predicate(context, subData, index, data)) {
          stream.seek(position);
          break;
        }
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
    const usedData = [];
    let index = 0;
    for (const subData of data) {
      listContext.set('index', index);
      if (!this.predicate(context, subData, index, usedData)) {
        break;
      }
      this.subTag._pack_(stream, subData, listContext);
      usedData.push(subData);
      index += 1;
    }
  }
}

class RepeatUntil extends Repeat {
  constructor(subTag, predicate) {
    super(subTag, (...args) => !predicate(...args));
  }
}
class RepeatWhile extends Repeat {}

module.exports = {
  repeat_until: tagWithParams(RepeatUntil),
  repeat_while: tagWithParams(RepeatWhile),
};
