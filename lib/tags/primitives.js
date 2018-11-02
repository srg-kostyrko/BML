const { BaseTag, createTag } = require('./base');
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
} = require('../types');

class Primitive extends BaseTag {
  get type() {
    throw new NotImplementedError(
      `type is not defined in ${this.constructor.name}`
    );
  }

  _parse_(stream, _context) {
    return stream.read(this.type);
  }

  _pack_(stream, data, _context) {
    return stream.write(this.type, data);
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
module.exports = {
  int8: createTag(Int8),
  uint8: createTag(Uint8),
  int16: createTag(Int16),
  uint16: createTag(Uint16),
  int32: createTag(Int32),
  uint32: createTag(Uint32),
  float32: createTag(Float32),
  float64: createTag(Float64),
};
