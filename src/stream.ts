import { Stream, DataType, StreamInput, Endian } from './contracts';
import { typeSettings } from './types';
import { TypeError } from './errors';

const BIT_CURSOR_RESET_MARKER = 256;

export class BMLStream implements Stream {
  private cursor: number = 0;
  private bitBuffer: number | null = null;
  private bitCursor: number = 1;
  private content: ArrayBuffer;
  private view: DataView;

  public constructor(fromBuffer?: StreamInput) {
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

  public get eof(): boolean {
    return this.cursor >= this.content.byteLength;
  }

  private ensureSize(size: number): void {
    if (this.content.byteLength >= size) return;
    const newLength = this.content.byteLength * 2;
    const buffer = new ArrayBuffer(newLength);
    new Uint8Array(buffer).set(new Uint8Array(this.content));
    this.content = buffer;
    this.view = new DataView(this.content);
  }

  public finalize(): ArrayBuffer {
    this.flushBitBuffer();
    this.content = this.content.slice(0, this.cursor);
    return this.content;
  }

  public read(type: DataType, endian: Endian = Endian.BE): number {
    const settings = typeSettings[type];
    if (!settings) {
      throw new TypeError(`Unknown type ${type}`);
    }
    this.resetBitBuffer();
    const position = this.cursor;
    this.cursor += settings.size;
    settings.read(this.view, position, endian === Endian.LE);
    return settings.read(this.view, position, endian === Endian.LE);
  }

  public write(
    type: DataType,
    value: number,
    endian: Endian = Endian.BE
  ): void {
    const settings = typeSettings[type];
    if (!settings) {
      throw new TypeError(`Unknown type ${type}`);
    }
    this.flushBitBuffer();
    this.ensureSize(this.cursor + settings.size);
    const position = this.cursor;
    this.cursor += settings.size;
    settings.write(this.view, position, value, endian === Endian.LE);
  }

  public readBit(): number {
    if (this.bitBuffer === null) {
      this.bitBuffer = this.read(DataType.uint8);
    }
    const value = this.bitBuffer & this.bitCursor;
    this.bitCursor *= 2;
    if (this.bitCursor === BIT_CURSOR_RESET_MARKER) {
      this.bitBuffer = null;
      this.bitCursor = 1;
    }
    return value ? 1 : 0;
  }

  public writeBit(value: number): void {
    if (this.bitBuffer == null) {
      this.bitBuffer = 0;
    }
    if (value) {
      this.bitBuffer |= this.bitCursor;
    }
    this.bitCursor *= 2;
    if (this.bitCursor === BIT_CURSOR_RESET_MARKER) {
      this.flushBitBuffer();
    }
  }

  public tell(): number {
    return this.cursor;
  }

  public seek(offset: number): void {
    this.cursor = offset;
  }

  public skip(offset: number): void {
    this.cursor += offset;
  }

  private resetBitBuffer(): void {
    this.bitCursor = 1;
    this.bitBuffer = null;
  }

  private flushBitBuffer(): void {
    if (this.bitBuffer != null) {
      const bitBuffer = this.bitBuffer;
      this.bitBuffer = null;
      this.write(DataType.uint8, bitBuffer);
    }
    this.bitCursor = 1;
  }
}
