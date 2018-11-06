const { tagWithParams, Tag } = require('./base');
const { ctxLogger } = require('../context');
const { functor } = require('../utils');

class Tap extends Tag {
  constructor(into) {
    super();
    if (into) {
      this.into = functor(into);
    }
  }

  tap(context) {
    const logger = ctxLogger(context);
    if (this.into) {
      logger.debug(
        `${this.into.property || this.into.name}: ${this.into(context)}`
      );
    } else {
      logger.debug(context.toJSON());
    }
  }

  _parse_(_stream, context) {
    this.tap(context);
    return null;
  }

  _pack_(_stream, _data, context) {
    this.tap(context);
  }

  _size_(_context) {
    return 0;
  }
}

module.exports = {
  tap: tagWithParams(Tap),
};
