import { BMLStream } from './stream';
import { Context } from './context';
import { TagOrWrapper, unwrapTag } from './tags/tag';
import { StreamInput } from './contracts';

function prepareContext(contextData: Object) {
  let context = new Context();
  if (contextData) {
    if (contextData instanceof Context) {
      context = contextData;
    } else {
      context.fill(contextData);
    }
  }
  return context;
}

export function parse<T>(
  rootTag: TagOrWrapper<T>,
  data: StreamInput,
  contextData: Object = {}
): T {
  const stream = new BMLStream(data);
  const context = prepareContext(contextData);
  const tag = unwrapTag(rootTag);
  return tag.parse(stream, context);
}

export function pack<T>(
  rootTag: TagOrWrapper<T>,
  data: T,
  contextData: Object = {}
) {
  const stream = new BMLStream();
  const context = prepareContext(contextData);
  const tag = unwrapTag(rootTag);
  tag.pack(stream, data, context);
  return stream.finalize();
}

export * from './contracts';
export * from './constants';
export * from './errors';
export * from './context';
export * from './tags';
