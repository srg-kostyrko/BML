import { Context, Stream } from '../contracts';

export abstract class Tag<T> {
  public name: string | null = null;

  public constructor() {
    // noop
  }

  abstract parse(stream: Stream, context: Context): T;

  abstract pack(stream: Stream, data: T, context: Context): void;

  public named(name: string): this {
    this.name = name;
    return this;
  }
}

export interface TagCreator<T> {
  create(): Tag<T>;
  name: string;
}
export interface TagWrapperFunction<T> {
  (input?: string | TemplateStringsArray): TagCreator<T>;
}

export type TagProducer<T> = TagWrapperFunction<T> & TagCreator<T>;

export function createTag<T, TagArgs extends unknown[]>(
  tagClass: { new (...args: TagArgs): Tag<T> },
  ...args: TagArgs
): TagProducer<T> {
  const tagFn: TagProducer<T> = Object.assign(
    (input?: string | TemplateStringsArray): TagCreator<T> => {
      let name: string;
      if (typeof input === 'string') {
        name = input; // calling tag with name as usual function
      } else if (Array.isArray(input) && input.raw) {
        [name] = input; // calling tag as template fn
      }
      return {
        name: tagClass.name.toLowerCase(),
        create(): Tag<T> {
          return new tagClass(...args).named(name);
        },
      };
    },
    {
      create(): Tag<T> {
        return new tagClass(...args);
      },
    }
  );
  Object.defineProperty(tagFn, 'name', {
    value: tagClass.name.toLowerCase(),
  });
  return tagFn;
}

export type TagOrWrapper<T> = TagCreator<T> | Tag<T>;

export function unwrapTag<T>(tag: TagOrWrapper<T>): Tag<T> {
  if (tag instanceof Tag) return tag;
  if (tag && tag.create) {
    return tag.create();
  }
  throw new Error();
}
