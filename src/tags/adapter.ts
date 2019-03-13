import { Context, Stream } from '../contracts';

import { Tag, unwrapTag, TagOrWrapper } from './tag';

export abstract class Adapter<From, To> extends Tag<To> {
  private tag: Tag<From>;

  public constructor(tag: TagOrWrapper<From>) {
    super();
    this.tag = unwrapTag<From>(tag);
  }

  public parse(stream: Stream, context: Context): To {
    const data = this.tag.parse(stream, context);
    return this.decode(data, context);
  }

  public pack(stream: Stream, data: To, context: Context): void {
    const encoded = this.encode(data, context);
    this.tag.pack(stream, encoded, context);
  }

  abstract decode(data: From, context: Context): To;

  abstract encode(data: To, context: Context): From;
}
