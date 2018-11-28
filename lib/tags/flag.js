const { Adapter, tag } = require('./base');
const { byte } = require('./primitives');

class Flag extends Adapter {
  constructor(subTag = byte) {
    super(subTag);
  }

  _decode_(data, _context) {
    return data !== 0;
  }

  _encode_(data, _context) {
    return data ? 1 : 0;
  }
}

module.exports = {
  flag: tag(Flag),
};
