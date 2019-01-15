import { IStream, DataType, StreamInput, Endian } from './contracts';
import { typeSettings } from './types';
import { TypeError } from './errors';

export class BMLStream implements IStream {
  cursor: number = 0;
  content: ArrayBuffer;
  view: DataView;

  constructor(fromBuffer?: StreamInput) {
    if (fromBuffer) {
      let buffer = fromBuffer;
      if (ArrayBuffer.isView(fromBuffer)) {
        buffer = fromBuffer.buffer.slice(
          fromBuffer.byteOffset,
          fromBuffer.byteOffset + fromBuffer.byteLength
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
  }

  get eof() {
    return this.cursor >= this.content.byteLength;
  }

  ensureSize(size: number) {
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

  read(type: DataType, endian: Endian = Endian.BE): number {
    const settings = typeSettings[type];
    if (!settings) {
      throw new TypeError(`Unknown type ${type}`);
    }
    const position = this.cursor;
    this.cursor += settings.size;
    settings.read(this.view, position, endian === Endian.LE);
    return settings.read(this.view, position, endian === Endian.LE);
  }

  write(type: DataType, value: number, endian: Endian = Endian.BE) {
    const settings = typeSettings[type];
    if (!settings) {
      throw new TypeError(`Unknown type ${type}`);
    }
    this.ensureSize(this.cursor + settings.size);
    const position = this.cursor;
    this.cursor += settings.size;
    return settings.write(this.view, position, value, endian === Endian.LE);
  }

  tell() {
    return this.cursor;
  }

  seek(offset: number) {
    this.cursor = offset;
  }

  skip(offset: number) {
    this.cursor += offset;
  }
}
