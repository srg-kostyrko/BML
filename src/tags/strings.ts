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
import { encoders } from './utils/encoding';

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
    const encoding = this.getEncoding(context);
    const decoder = encoders[encoding].decode;
    return decoder(data);
  }

  public encode(data: string, context: Context): number[] {
    const encoding = this.getEncoding(context);
    const encoder = encoders[encoding].encode;
    return encoder(data);
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

  public constructor(length: ContextGetterArg<number>) {
    super();
    this.length = createContextGetter(length);
  }

  public parse(stream: Stream, context: Context): number[] {
    let count = this.length(context);
    const result = [];
    while (count > 0) {
      result.push(stream.read(DataType.uint8));
      count -= 1;
    }
    return result;
  }

  public pack(stream: Stream, data: number[], context: Context): void {
    const count = this.length(context);
    let i = 0;
    while (i < count) {
      stream.write(DataType.uint8, data[i] || 0);
      i += 1;
    }
  }
}

export function stringReader(
  length: ContextGetterArg<number>
): TagProducer<number[]> {
  return createTag(StringReader, length);
}

class PascalStringReader extends Tag<number[]> {
  private lengthTag: Tag<number>;

  public constructor(lengthTag: TagOrWrapper<number>) {
    super();
    this.lengthTag = unwrapTag(lengthTag);
  }

  public parse(stream: Stream, context: Context): number[] {
    let count = this.lengthTag.parse(stream, context);
    const result = [];
    while (count > 0) {
      result.push(stream.read(DataType.uint8));
      count -= 1;
    }
    return result;
  }

  public pack(stream: Stream, data: number[], context: Context): void {
    this.lengthTag.pack(stream, data.length, context);
    for (const dataPart of data) {
      stream.write(DataType.uint8, dataPart);
    }
  }
}

export function pascalStringReader(
  lengthTag: TagOrWrapper<number>
): TagProducer<number[]> {
  return createTag(PascalStringReader, lengthTag);
}

class CStringReader extends Tag<number[]> {
  public parse(stream: Stream): number[] {
    const result = [];
    while (!stream.eof) {
      const data = stream.read(DataType.uint8);
      if (data === 0) {
        break;
      }
      result.push(data);
    }
    return result;
  }

  public pack(stream: Stream, data: number[]): void {
    for (const dataPart of data) {
      stream.write(DataType.uint8, dataPart);
    }
    stream.write(DataType.uint8, 0);
  }
}

export const cStringReader = createTag(CStringReader);

class GreedyStringReader extends Tag<number[]> {
  public parse(stream: Stream): number[] {
    const result = [];
    while (!stream.eof) {
      const data = stream.read(DataType.uint8);
      result.push(data);
    }
    return result;
  }

  public pack(stream: Stream, data: number[]): void {
    for (const dataPart of data) {
      stream.write(DataType.uint8, dataPart);
    }
  }
}

export const greedyStringReader = createTag(GreedyStringReader);

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
  return stringEncoder(cStringReader, encoding);
}

export function greedyString(
  encoding: Encoding = Encoding.ascii
): TagProducer<string> {
  return stringEncoder(greedyStringReader, encoding);
}

class EncodingTag extends Tag<Encoding> {
  private encoding: ContextGetter<Encoding>;

  public constructor(endian: ContextGetterArg<Encoding>) {
    super();
    this.encoding = createContextGetter(endian);
  }

  public parse(_: Stream, context: Context): Encoding {
    const encoding = this.encoding(context);
    context.set(ENCODING_KEY, encoding);
    return encoding;
  }

  public pack(stream: Stream, _: Encoding, context: Context): void {
    this.parse(stream, context);
  }
}

export function encoding(
  encoding: ContextGetterArg<Encoding>
): TagProducer<Encoding> {
  return createTag(EncodingTag, encoding);
}
