import { ENDIAN_KEY } from '../constants';
import {
  Context,
  Stream,
  ContextGetterArg,
  ContextGetter,
  Endian,
} from '../contracts';
import { createContextGetter } from '../context';

import { Tag, createTag, TagCreator, TagWrapperFunction } from './tag';

class EndianTag extends Tag<Endian> {
  private endian: ContextGetter<Endian>;

  public constructor(endian: ContextGetterArg<Endian>) {
    super();
    this.endian = createContextGetter(endian);
  }

  public parse(_: Stream, context: Context): Endian {
    const endian = this.endian(context);
    context.set(ENDIAN_KEY, endian);
    return endian;
  }

  public pack(stream: Stream, _: Endian, context: Context): void {
    this.parse(stream, context);
  }
}

export function endian(
  endian: ContextGetterArg<Endian>
): TagWrapperFunction<Endian> & TagCreator<Endian> {
  return createTag(EndianTag, endian);
}
