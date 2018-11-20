const { Tag, tag } = require('./base');

class Pass extends Tag {
  /* eslint-disable class-methods-use-this */
  _parse_(_stream, _context) {
    // noop
    return null;
  }

  _pack_(_stream, _data, _context) {
    // noop
  }
  /* eslint-enable class-methods-use-this */
}

module.exports = {
  pass: tag(Pass),
};
