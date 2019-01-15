import { IContext, IStream, DataType, Endian } from '../contracts';
import { ENDIAN_KEY } from '../constants';

import { Tag, createTag } from './tag';

abstract class Primitive extends Tag<number> {
  abstract get type(): DataType;

  parse(stream: IStream, context: IContext) {
    const endian = context.get<Endian>(ENDIAN_KEY);
    return stream.read(this.type, endian);
  }

  pack(stream: IStream, data: number, context: IContext) {
    const endian = context.get<Endian>(ENDIAN_KEY);
    return stream.write(this.type, data, endian);
  }
}

class Int8 extends Primitive {
  get type() {
    return DataType.int8;
  }
}

class Uint8 extends Primitive {
  get type() {
    return DataType.uint8;
  }
}

class Int16 extends Primitive {
  get type() {
    return DataType.int16;
  }
}

class Uint16 extends Primitive {
  get type() {
    return DataType.uint16;
  }
}

class Int32 extends Primitive {
  get type() {
    return DataType.int32;
  }
}

class Uint32 extends Primitive {
  get type() {
    return DataType.uint32;
  }
}

class Float32 extends Primitive {
  get type() {
    return DataType.float32;
  }
}

class Float64 extends Primitive {
  get type() {
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
