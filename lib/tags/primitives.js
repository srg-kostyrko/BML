const { Tag, tag } = require('./base');
const { NotImplementedError } = require('../errors');
const {
  INT8,
  UINT8,
  INT16,
  UINT16,
  INT32,
  UINT32,
  FLOAT32,
  FLOAT64,
  typeSettings,
} = require('../types');
const { TypeError } = require('../errors');

class Primitive extends Tag {
  get type() {
    throw new NotImplementedError(
      `type is not defined in ${this.constructor.name}`
    );
  }

  _parse_(stream, context) {
    const endian = context.get('_endian_');
    return stream.read(this.type, endian);
  }

  _pack_(stream, data, context) {
    const endian = context.get('_endian_');
    return stream.write(this.type, data, endian);
  }

  _size_(_context) {
    const settings = typeSettings[this.type];
    if (!settings) {
      throw new TypeError(`Unknown type ${this.type}`);
    }
    return settings.size;
  }
}

class Int8 extends Primitive {
  get type() {
    return INT8;
  }
}

class Uint8 extends Primitive {
  get type() {
    return UINT8;
  }
}

class Int16 extends Primitive {
  get type() {
    return INT16;
  }
}

class Uint16 extends Primitive {
  get type() {
    return UINT16;
  }
}

class Int32 extends Primitive {
  get type() {
    return INT32;
  }
}

class Uint32 extends Primitive {
  get type() {
    return UINT32;
  }
}

class Float32 extends Primitive {
  get type() {
    return FLOAT32;
  }
}

class Float64 extends Primitive {
  get type() {
    return FLOAT64;
  }
}

class Byte extends Uint8 {}
class Short extends Uint16 {}
class Int extends Uint32 {}
class Single extends Float32 {}
class Double extends Float64 {}

module.exports = {
  int8: tag(Int8),
  uint8: tag(Uint8),
  int16: tag(Int16),
  uint16: tag(Uint16),
  int32: tag(Int32),
  uint32: tag(Uint32),
  float32: tag(Float32),
  float64: tag(Float64),
  byte: tag(Byte),
  short: tag(Short),
  int: tag(Int),
  single: tag(Single),
  double: tag(Double),
};
