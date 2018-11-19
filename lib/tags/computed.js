const { Tag, tagWithParams } = require('./base');
const { functor } = require('../utils');

class Computed extends Tag {
  constructor(compute) {
    super();
    this.compute = functor(compute);
  }

  _parse_(_stream, context) {
    const computedValue = this.compute(context);
    if (this.name) {
      context.set(this.name, computedValue);
    }
    return computedValue;
  }

  _pack_(stream, _data, context) {
    this._parse_(stream, context);
  }

  _size_(_context) {
    return 0;
  }
}

const computed = tagWithParams(Computed);

module.exports = {
  computed,
};
