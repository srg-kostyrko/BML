const { typeSettings } = require('./types');
const { TypeError } = require('./errors');

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
    const settings = typeSettings[type];
    if (!settings) {
      throw new TypeError(`Unknown type ${type}`);
    }
    const position = this.cursor;
    this.cursor += settings.size;
    return this.view[settings.read](position);
  }

  write(type, value) {
    const settings = typeSettings[type];
    if (!settings) {
      throw new TypeError(`Unknown type ${type}`);
    }
    this.ensureSize(this.cursor + settings.size);
    const position = this.cursor;
    this.cursor += settings.size;
    return this.view[settings.write](position, value);
  }
}

module.exports = {
  BMLStream,
};
