const {
  INT8,
  UINT8,
  INT16,
  UINT16,
  INT32,
  UINT32,
  FLOAT32,
  FLOAT64,
} = require('./types');

const settings = {
  [INT8]: {
    read: 'getInt8',
    write: 'setInt8',
    size: 1,
  },
  [UINT8]: {
    read: 'getUint8',
    write: 'setUint8',
    size: 1,
  },
  [INT16]: {
    read: 'getInt16',
    write: 'setInt16',
    size: 2,
  },
  [UINT16]: {
    read: 'getUint16',
    write: 'setUint16',
    size: 2,
  },
  [INT32]: {
    read: 'getInt32',
    write: 'setInt32',
    size: 4,
  },
  [UINT32]: {
    read: 'getUint32',
    write: 'setUint32',
    size: 4,
  },
  [FLOAT32]: {
    read: 'getFloat32',
    write: 'setFloat32',
    size: 4,
  },
  [FLOAT64]: {
    read: 'getFloat64',
    write: 'setFloat64',
    size: 8,
  },
};
class BMLStream {
  constructor(fromBuffer) {
    this.cursor = 0;

    if (fromBuffer) {
      if (!(fromBuffer instanceof ArrayBuffer)) {
        throw new TypeError('Source must be an instance of ArrayBuffer');
      }
      this.content = fromBuffer;
    } else {
      this.content = new ArrayBuffer(256);
    }
    this.view = new DataView(this.content);
  }

  ensureSize(size) {
    if (this.content.byteLength >= size) return;
    const newLength = this.content.byteLength * 2;
    const buffer = new ArrayBuffer(newLength);
    new Uint8Array(buffer).set(new Uint8Array(this.content));
    this.content = buffer;
    this.view = new DataView(this.content);
  }

  finalize() {
    this.content = this.content.slice(0, this.cursor);
    return this.content;
  }

  read(type) {
    const typeSettings = settings[type];
    if (!typeSettings) {
      throw new Error(`Unknown type ${type}`);
    }
    const position = this.cursor;
    this.cursor += typeSettings.size;
    return this.view[typeSettings.read](position);
  }

  write(type, value) {
    const typeSettings = settings[type];
    if (!typeSettings) {
      throw new Error(`Unknown type ${type}`);
    }
    this.ensureSize(this.cursor + typeSettings.size);
    const position = this.cursor;
    this.cursor += typeSettings.size;
    return this.view[typeSettings.write](position, value);
  }
}

module.exports = {
  BMLStream,
};
