import { Context, Stream, DataType, Endian } from '../contracts';
import { ENDIAN_KEY } from '../constants';

import { Tag, createTag } from './tag';
import { createAdapter } from './adapter';

abstract class Primitive extends Tag<number> {
  abstract get type(): DataType;

  public parse(stream: Stream, context: Context): number {
    const endian = context.get<Endian>(ENDIAN_KEY);
    return stream.read(this.type, endian);
  }

  public pack(stream: Stream, data: number, context: Context): void {
    const endian = context.get<Endian>(ENDIAN_KEY);
    return stream.write(this.type, data, endian);
  }
}

class Int8 extends Primitive {
  public get type(): DataType {
    return DataType.int8;
  }
}

class Uint8 extends Primitive {
  public get type(): DataType {
    return DataType.uint8;
  }
}

class Int16 extends Primitive {
  public get type(): DataType {
    return DataType.int16;
  }
}

class Uint16 extends Primitive {
  public get type(): DataType {
    return DataType.uint16;
  }
}

class Int32 extends Primitive {
  public get type(): DataType {
    return DataType.int32;
  }
}

class Uint32 extends Primitive {
  public get type(): DataType {
    return DataType.uint32;
  }
}

class Float32 extends Primitive {
  public get type(): DataType {
    return DataType.float32;
  }
}

class Float64 extends Primitive {
  public get type(): DataType {
    return DataType.float64;
  }
}

class Byte extends Uint8 {}
class Short extends Uint16 {}
class Int extends Uint32 {}
class Float extends Float32 {}
class Double extends Float64 {}

export const int8 = createTag(Int8);
export const uint8 = createTag(Uint8);
export const int16 = createTag(Int16);
export const uint16 = createTag(Uint16);
export const int32 = createTag(Int32);
export const uint32 = createTag(Uint32);
export const float32 = createTag(Float32);
export const float64 = createTag(Float64);
export const byte = createTag(Byte);
export const short = createTag(Short);
export const int = createTag(Int);
export const float = createTag(Float);
export const double = createTag(Double);

class UInt24 extends Tag<number> {
  public parse(stream: Stream, context: Context): number {
    const endian = context.get<Endian>(ENDIAN_KEY);
    const byte1 = stream.read(DataType.uint8);
    const byte2 = stream.read(DataType.uint8);
    const byte3 = stream.read(DataType.uint8);

    let value;
    if (endian === Endian.LE) {
      value = byte3 << 16;
      value |= byte2 << 8;
      value |= byte1;
    } else {
      value = byte1 << 16;
      value |= byte2 << 8;
      value |= byte3;
    }

    return value;
  }

  public pack(stream: Stream, data: number, context: Context): void {
    const endian = context.get<Endian>(ENDIAN_KEY);
    const byte1 = (data & 0xff0000) >>> 16;
    const byte2 = (data & 0x00ff00) >>> 8;
    const byte3 = data & 0x0000ff;

    if (endian === Endian.LE) {
      stream.write(DataType.uint8, byte3);
      stream.write(DataType.uint8, byte2);
      stream.write(DataType.uint8, byte1);
    } else {
      stream.write(DataType.uint8, byte1);
      stream.write(DataType.uint8, byte2);
      stream.write(DataType.uint8, byte3);
    }
  }
}

export const uint24 = createTag(UInt24);

export const int24 = createAdapter(
  uint24,
  (data: number): number => {
    const isNegative = data & 0x800000;
    return isNegative ? (0xffffff - data + 1) * -1 : data;
  },
  (data: number): number => {
    return data >= 0 ? data : 0xffffff + data + 1;
  }
);
