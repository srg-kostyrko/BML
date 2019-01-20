import { IContext, IStream } from '../contracts';

export abstract class Tag<T> {
  public name: string | null = null;

  constructor(...args: any[]) {
    // noop
  }

  abstract parse(stream: IStream, context: IContext): T;

  abstract pack(stream: IStream, data: T, context: IContext): void;

  named(name: string) {
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

export function createTag<T>(
  tagClass: { new (...args: any[]): Tag<T> },
  ...args: any[]
): TagWrapperFunction<T> & TagCreator<T> {
  const tagFn: TagWrapperFunction<T> & TagCreator<T> = Object.assign(
    (input?: string | TemplateStringsArray) => {
      let name: string;
      if (typeof input === 'string') {
        name = input; // calling tag with name as usual function
      } else if (Array.isArray(input) && input.raw) {
        [name] = input; // calling tag as template fn
      }
      return {
        name: tagClass.name.toLowerCase(),
        create() {
          return new tagClass(...args).named(name);
        },
      };
    },
    {
      create() {
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