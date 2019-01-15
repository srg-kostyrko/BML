import { ENDIAN_KEY } from '../constants';
import {
  IContext,
  IStream,
  ContextGetterArg,
  ContextGetter,
  Endian,
} from '../contracts';
import { createContextGetter } from '../context';

import { Tag, createTag } from './tag';

class EndianTag extends Tag<Endian> {
  endian: ContextGetter<Endian>;

  constructor(endian: ContextGetterArg<Endian>) {
    super();
    this.endian = createContextGetter(endian);
  }

  parse(stream: IStream, context: IContext) {
    const endian = this.endian(context);
    context.set(ENDIAN_KEY, endian);
    return endian;
  }

  pack(stream: IStream, data: Endian, context: IContext) {
    this.parse(stream, context);
  }
}

export function endian(endian: ContextGetterArg<Endian>) {
  return createTag(EndianTag, endian);
}
