const { typeSettings } = require('./types');
const { TypeError } = require('./errors');
const { ENDIAN } = require('./constants');

class BMLStream {
  constructor(fromBuffer) {
    this.cursor = 0;
    this.bitsCursor = 0;

    if (fromBuffer) {
      let buffer = fromBuffer;
      if (ArrayBuffer.isView(fromBuffer)) {
        buffer = fromBuffer.buffer.slice(
          fromBuffer.byteOffset,
          fromBuffer.byteOffset + fromBuffer.length
        );
      }
      if (!(buffer instanceof ArrayBuffer)) {
        throw new TypeError('Source must be an instance of ArrayBuffer');
      }
      this.content = buffer;
    } else {
      this.content = new ArrayBuffer(256);
    }
    this.view = new DataView(this.content);
    this.bitsView = [];
  }

  get eof() {
    return this.cursor >= this.content.byteLength;
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

  read(type, endian = ENDIAN.BE) {
    const settings = typeSettings[type];
    if (!settings) {
      throw new TypeError(`Unknown type ${type}`);
    }
    const position = this.cursor;
    this.cursor += settings.size;
    return this.view[settings.read](position, endian);
  }

  write(type, value, endian = ENDIAN.BE) {
    const settings = typeSettings[type];
    if (!settings) {
      throw new TypeError(`Unknown type ${type}`);
    }
    this.ensureSize(this.cursor + settings.size);
    const position = this.cursor;
    this.cursor += settings.size;
    return this.view[settings.write](position, value, endian);
  }

  tell() {
    return this.cursor;
  }

  seek(offset) {
    this.cursor = offset;
  }

  skip(offset) {
    this.cursor += offset;
  }
}

module.exports = {
  BMLStream,
};
