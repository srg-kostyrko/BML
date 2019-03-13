import { BMLStream } from './stream';
import { createContext } from './context';
import { TagOrWrapper, unwrapTag } from './tags/tag';
import { StreamInput, Context } from './contracts';

function prepareContext(
  contextData: object | { toJSON: () => object }
): Context {
  let context = createContext();
  if (contextData) {
    if ('toJSON' in contextData) {
      context.fill(contextData.toJSON());
    } else {
      context.fill(contextData);
    }
  }
  return context;
}

export function parse<T>(
  rootTag: TagOrWrapper<T>,
  data: StreamInput,
  contextData: object = {}
): T {
  const stream = new BMLStream(data);
  const context = prepareContext(contextData);
  const tag = unwrapTag(rootTag);
  return tag.parse(stream, context);
}

export function pack<T>(
  rootTag: TagOrWrapper<T>,
  data: T,
  contextData: object = {}
): ArrayBuffer {
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
