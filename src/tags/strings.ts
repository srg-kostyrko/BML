import {
  Context,
  Stream,
  ContextGetter,
  ContextGetterArg,
  DataType,
  Encoding,
} from '../contracts';
import { createContextGetter } from '../context';
import { ENCODING_KEY } from '../constants';

import { Tag, createTag, unwrapTag, TagOrWrapper, TagProducer } from './tag';
import { Adapter } from './adapter';

class StringEncoder extends Adapter<number[], string> {
  private encoding: Encoding | undefined;

  public constructor(subTag: TagOrWrapper<number[]>, encoding?: Encoding) {
    super(subTag);
    this.encoding = encoding;
  }

  public getEncoding(context: Context): Encoding {
    if (this.encoding) {
      return this.encoding;
    }
    return context.get<Encoding>(ENCODING_KEY) || Encoding.ascii;
  }

  public decode(data: number[], context: Context): string {
    this.getEncoding(context); // TODO add different encoding support
    return String.fromCharCode(...data);
  }

  public encode(data: string, context: Context): number[] {
    this.getEncoding(context); // TODO add different encoding support
    return data.split('').map(char => char.charCodeAt(0));
  }
}

export function stringEncoder(
  subTag: TagOrWrapper<number[]>,
  encoding?: Encoding
): TagProducer<string> {
  return createTag(StringEncoder, subTag, encoding);
}

class StringReader extends Tag<number[]> {
  private length: ContextGetter<number>;
  private primitive: DataType;

  public constructor(
    length: ContextGetterArg<number>,
    primitive: DataType = DataType.uint8
  ) {
    super();
    this.length = createContextGetter(length);
    this.primitive = primitive;
  }

  public parse(stream: Stream, context: Context): number[] {
    let count = this.length(context);
    const result = [];
    while (count > 0) {
      result.push(stream.read(this.primitive));
      count -= 1;
    }
    return result;
  }

  public pack(stream: Stream, data: number[], context: Context): void {
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
): TagProducer<number[]> {
  return createTag(StringReader, length, primitive);
}

class PascalStringReader extends Tag<number[]> {
  private lengthTag: Tag<number>;
  private primitive: DataType;

  public constructor(
    lengthTag: TagOrWrapper<number>,
    primitive: DataType = DataType.uint8
  ) {
    super();
    this.lengthTag = unwrapTag(lengthTag);
    this.primitive = primitive;
  }

  public parse(stream: Stream, context: Context): number[] {
    let count = this.lengthTag.parse(stream, context);
    const result = [];
    while (count > 0) {
      result.push(stream.read(this.primitive));
      count -= 1;
    }
    return result;
  }

  public pack(stream: Stream, data: number[], context: Context): void {
    this.lengthTag.pack(stream, data.length, context);
    for (const dataPart of data) {
      stream.write(this.primitive, dataPart);
    }
  }
}

export function pascalStringReader(
  lengthTag: TagOrWrapper<number>,
  primitive: DataType = DataType.uint8
): TagProducer<number[]> {
  return createTag(PascalStringReader, lengthTag, primitive);
}

class CStringReader extends Tag<number[]> {
  private primitive: DataType;

  public constructor(primitive: DataType = DataType.uint8) {
    super();
    this.primitive = primitive;
  }

  public parse(stream: Stream): number[] {
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

  public pack(stream: Stream, data: number[]): void {
    for (const dataPart of data) {
      stream.write(this.primitive, dataPart);
    }
    stream.write(this.primitive, 0);
  }
}

export function cStringReader(
  primitive: DataType = DataType.uint8
): TagProducer<number[]> {
  return createTag(CStringReader, primitive);
}

class GreedyStringReader extends Tag<number[]> {
  private primitive: DataType;

  public constructor(primitive: DataType = DataType.uint8) {
    super();
    this.primitive = primitive;
  }

  public parse(stream: Stream): number[] {
    const result = [];
    while (!stream.eof) {
      const data = stream.read(this.primitive);
      result.push(data);
    }
    return result;
  }

  public pack(stream: Stream, data: number[]): void {
    for (const dataPart of data) {
      stream.write(this.primitive, dataPart);
    }
  }
}

export function greedyStringReader(
  primitive: DataType = DataType.uint8
): TagProducer<number[]> {
  return createTag(GreedyStringReader, primitive);
}

export function string(
  length: ContextGetterArg<number>,
  encoding: Encoding = Encoding.ascii
): TagProducer<string> {
  return stringEncoder(stringReader(length), encoding);
}

export function pascalString(
  lengthTag: TagOrWrapper<number>,
  encoding: Encoding = Encoding.ascii
): TagProducer<string> {
  return stringEncoder(pascalStringReader(lengthTag), encoding);
}

export function cString(
  encoding: Encoding = Encoding.ascii
): TagProducer<string> {
  return stringEncoder(cStringReader(), encoding);
}

export function greedyString(
  encoding: Encoding = Encoding.ascii
): TagProducer<string> {
  return stringEncoder(greedyStringReader(), encoding);
}
