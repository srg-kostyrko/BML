import { IContext, IStream } from '../contracts';

import { Tag, unwrapTag, TagOrWrapper } from './tag';

export abstract class Adapter<From, To> extends Tag<To> {
  tag: Tag<From>;

  constructor(tag: TagOrWrapper<From>) {
    super();
    this.tag = unwrapTag<From>(tag);
  }

  parse(stream: IStream, context: IContext): To {
    const data = this.tag.parse(stream, context);
    return this.decode(data, context);
  }

  pack(stream: IStream, data: To, context: IContext): void {
    const encoded = this.encode(data, context);
    this.tag.pack(stream, encoded, context);
  }

  abstract decode(data: From, context: IContext): To;

  abstract encode(data: To, context: IContext): From;
}
