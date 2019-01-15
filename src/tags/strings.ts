import {
  IContext,
  IStream,
  ContextGetter,
  ContextGetterArg,
  DataType,
  Encoding,
} from '../contracts';
import { createContextGetter } from '../context';
import { ENCODING_KEY } from '../constants';

import { Tag, createTag, unwrapTag, TagOrWrapper } from './tag';
import { Adapter } from './adapter';

class StringEncoder extends Adapter<number[], string> {
  encoding: Encoding | undefined;

  constructor(subTag: TagOrWrapper<number[]>, encoding?: Encoding) {
    super(subTag);
    this.encoding = encoding;
  }

  getEncoding(context: IContext) {
    if (this.encoding) {
      return this.encoding;
    }
    return context.get<Encoding>(ENCODING_KEY) || Encoding.ascii;
  }

  decode(data: number[], context: IContext) {
    this.getEncoding(context); // TODO add different encoding support
    return String.fromCharCode(...data);
  }

  encode(data: string, context: IContext) {
    this.getEncoding(context); // TODO add different encoding support
    return data.split('').map(char => char.charCodeAt(0));
  }
}

export function stringEncoder(
  subTag: TagOrWrapper<number[]>,
  encoding?: Encoding
) {
  return createTag(StringEncoder, subTag, encoding);
}

class StringReader extends Tag<number[]> {
  length: ContextGetter<number>;
  primitive: DataType;

  constructor(
    length: ContextGetterArg<number>,
    primitive: DataType = DataType.uint8
  ) {
    super();
    this.length = createContextGetter(length);
    this.primitive = primitive;
  }

  parse(stream: IStream, context: IContext) {
    let count = this.length(context);
    const result = [];
    while (count > 0) {
      result.push(stream.read(this.primitive));
      count -= 1;
    }
    return result;
  }

  pack(stream: IStream, data: number[], context: IContext) {
    const count = this.length(context);
    let i = 0;
    while (i < count) {
      stream.write(this.primitive, data[i] || 0);
      i += 1;
    }
  }
}

export function stringReader(
  length: ContextGetterArg<number>,
  primitive: DataType = DataType.uint8
) {
  return createTag(StringReader, length, primitive);
}

class PascalStringReader extends Tag<number[]> {
  lengthTag: Tag<number>;
  primitive: DataType;

  constructor(
    lengthTag: TagOrWrapper<number>,
    primitive: DataType = DataType.uint8
  ) {
    super();
    this.lengthTag = unwrapTag(lengthTag);
    this.primitive = primitive;
  }

  parse(stream: IStream, context: IContext) {
    let count = this.lengthTag.parse(stream, context);
    const result = [];
    while (count > 0) {
      result.push(stream.read(this.primitive));
      count -= 1;
    }
    return result;
  }

  pack(stream: IStream, data: number[], context: IContext) {
    this.lengthTag.pack(stream, data.length, context);
    for (const dataPart of data) {
      stream.write(this.primitive, dataPart);
    }
  }
}

export function pascalStringReader(
  lengthTag: TagOrWrapper<number>,
  primitive: DataType = DataType.uint8
) {
  return createTag(PascalStringReader, lengthTag, primitive);
}

class CStringReader extends Tag<number[]> {
  primitive: DataType;

  constructor(primitive: DataType = DataType.uint8) {
    super();
    this.primitive = primitive;
  }

  parse(stream: IStream, context: IContext) {
    const result = [];
    while (!stream.eof) {
      const data = stream.read(this.primitive);
      if (data === 0) {
        break;
      }
      result.push(data);
    }
    return result;
  }

  pack(stream: IStream, data: number[], context: IContext) {
    for (const dataPart of data) {
      stream.write(this.primitive, dataPart);
    }
    stream.write(this.primitive, 0);
  }
}

export function cStringReader(primitive: DataType = DataType.uint8) {
  return createTag(CStringReader, primitive);
}

class GreedyStringReader extends Tag<number[]> {
  primitive: DataType;
  constructor(primitive: DataType = DataType.uint8) {
    super();
    this.primitive = primitive;
  }

  parse(stream: IStream, context: IContext) {
    const result = [];
    while (!stream.eof) {
      const data = stream.read(this.primitive);
      result.push(data);
    }
    return result;
  }

  pack(stream: IStream, data: number[], context: IContext) {
    for (const dataPart of data) {
      stream.write(this.primitive, dataPart);
    }
  }
}

export function greedyStringReader(primitive: DataType = DataType.uint8) {
  return createTag(GreedyStringReader, primitive);
}

export function string(
  length: ContextGetterArg<number>,
  encoding: Encoding = Encoding.ascii
) {
  return stringEncoder(stringReader(length), encoding);
}

export function pascalString(
  lengthTag: TagOrWrapper<number>,
  encoding: Encoding = Encoding.ascii
) {
  return stringEncoder(pascalStringReader(lengthTag), encoding);
}

export function cString(encoding: Encoding = Encoding.ascii) {
  return stringEncoder(cStringReader(), encoding);
}

export function greedyString(encoding: Encoding = Encoding.ascii) {
  return stringEncoder(greedyStringReader(), encoding);
}
