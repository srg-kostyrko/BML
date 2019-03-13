import { Tag, createTag } from './tag';
import { Stream, DataType } from '../contracts';

class VarInt extends Tag<number> {
  public parse(stream: Stream): number {
    const acc: number[] = [];
    while (true) {
      const byte = stream.read(DataType.uint8);
      acc.push(byte & 0b01111111);
      if (!(byte & 0b10000000)) {
        break;
      }
    }
    let value = 0;
    for (const byte of acc.reverse()) {
      value = (value << 7) | byte;
    }
    return value;
  }

  public pack(stream: Stream, data: number): void {
    if (data < 0) {
      throw new TypeError(`varint cannot build from negative number: ${data}`);
    }
    let x = data;
    while (x > 0b01111111) {
      stream.write(DataType.uint8, 0b10000000 | (x & 0b01111111));
      x >>= 7;
    }
    stream.write(DataType.uint8, x);
  }
}

export const varint = createTag(VarInt);
