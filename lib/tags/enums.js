const { Adapter, tagWithParams } = require('./base');

// Translates unicode label names to tag values, and vice versa.
class Enums extends Adapter {
  constructor(tag, map) {
    super(tag);
    this.encodeMap = new Map();
    this.decodeMap = new Map();
    if (Array.isArray(map)) {
      for (const [value, key] of map.entries()) {
        this.encodeMap.set(key, value);
        this.decodeMap.set(value, key);
      }
    } else {
      for (const [key, value] of Object.entries(map)) {
        this.encodeMap.set(key, value);
        this.decodeMap.set(value, key);
      }
    }
  }

  _decode_(data, _context) {
    return this.decodeMap.get(data);
  }

  _encode_(data, _context) {
    return this.encodeMap.get(data);
  }

  _size_(_context) {
    return this.tag._size_(_context);
  }
}

module.exports = {
  enums: tagWithParams(Enums),
};
