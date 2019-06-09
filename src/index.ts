import { BMLStream } from './stream';
import { createContext } from './context';
import { TagOrWrapper, unwrapTag } from './tags/tag';
import { StreamInput, Context } from './contracts';

function prepareContext(
  contextData: Record<string, unknown> | { toJSON(): Record<string, unknown> }
): Context {
  let context = createContext();
  if (contextData) {
    if (typeof contextData.toJSON === 'function') {
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
  contextData: Record<string, unknown> = {}
): T {
  const stream = new BMLStream(data);
  const context = prepareContext(contextData);
  const tag = unwrapTag(rootTag);
  return tag.parse(stream, context);
}

export function pack<T>(
  rootTag: TagOrWrapper<T>,
  data: T,
  contextData: Record<string, unknown> = {}
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
