import {
  Context as IContext,
  ContextGetterArg,
  ContextGetter,
  Logger as ILogger,
} from './contracts';
import { LOGGER_KEY } from './constants';
import { Logger } from './logger';

class ContextImpl implements IContext {
  private parent: IContext | undefined;
  private data: Map<string, unknown> = new Map();

  public constructor(parent?: IContext) {
    this.parent = parent;
    // for root context
    if (!parent) {
      this.set(LOGGER_KEY, new Logger());
    }
  }

  public get<T>(key: string): T {
    const [topKey, ...path] = key.split('.');
    let value;
    let valueFound = false;
    if (this.data.has(topKey)) {
      value = this.data.get(topKey);
      valueFound = true;
    }
    if (!valueFound && this.parent) {
      value = this.parent.get(topKey);
    }
    if (!path.length) return value as T;

    let index = 0;
    while (value != null && index < path.length) {
      value = (value as { [key: string]: unknown })[path[index]];
      index += 1;
    }

    return value as T;
  }

  public set(key: string, value: unknown): void {
    const [topKey, ...path] = key.split('.');
    if (path.length) {
      let object: { [key: string]: unknown } =
        (this.data.get(topKey) as { [key: string]: unknown }) || {};
      const topObject = object;
      let index = 0;
      while (index < path.length - 1) {
        object[path[index]] = object[path[index]] || {};
        object = object[path[index]] as { [key: string]: unknown };
        index += 1;
      }
      object[path[index]] = value;
      this.data.set(topKey, topObject);
    } else {
      this.data.set(key, value);
    }
  }

  public fill(data: Record<string, unknown>): void {
    for (const [key, value] of Object.entries(data)) {
      this.data.set(key, value);
    }
  }

  public toJSON(): Record<string, unknown> {
    const parent = this.parent ? this.parent.toJSON() : {};
    const json: Record<string, unknown> = {};
    this.data.forEach((value, key): void => {
      if (key === LOGGER_KEY) return;
      json[key] = value;
    });

    return {
      ...parent,
      ...json,
    };
  }
}

export function createContext(parent?: IContext): IContext {
  return new ContextImpl(parent);
}

export function createContextGetter<T>(
  input: ContextGetterArg<T>
): ContextGetter<T> {
  if (typeof input === 'function') {
    return input as ContextGetter<T>;
  }
  return (): T => input;
}

function fromContext<T>(property: string, context: IContext): T {
  return context.get<T>(property);
}

enum Comparator {
  eq,
  neq,
  lt,
  lte,
  gt,
  gte,
}

interface ComparatorSide<T> {
  (right: T): (context: IContext) => boolean;
}

const comparatorFns = {
  [Comparator.eq]: <T>(left: T, right: T): boolean => left === right,
  [Comparator.neq]: <T>(left: T, right: T): boolean => left !== right,
  [Comparator.lt]: <T>(left: T, right: T): boolean => left < right,
  [Comparator.lte]: <T>(left: T, right: T): boolean => left <= right,
  [Comparator.gt]: <T>(left: T, right: T): boolean => left > right,
  [Comparator.gte]: <T>(left: T, right: T): boolean => left >= right,
};

function createComparator<T>(
  type: Comparator
): (left: T, right: T) => (context: IContext) => boolean {
  return function compare(left: T, right: T): (context: IContext) => boolean {
    return function compareFn(context: IContext): boolean {
      const leftFn = createContextGetter<T>(left);
      const rightFn = createContextGetter<T>(right);
      return comparatorFns[type](leftFn(context), rightFn(context));
    };
  };
}

const eq = createComparator(Comparator.eq);
const neq = createComparator(Comparator.neq);
const lt = createComparator(Comparator.lt);
const lte = createComparator(Comparator.lte);
const gt = createComparator(Comparator.gt);
const gte = createComparator(Comparator.gte);

export interface ContextFunction<T> {
  (context: IContext): T;
  property: string;
  eq: ComparatorSide<T>;
  neq: ComparatorSide<T>;
  lt: ComparatorSide<T>;
  lte: ComparatorSide<T>;
  gt: ComparatorSide<T>;
  gte: ComparatorSide<T>;
}

export function ctx<T>([property]: TemplateStringsArray): ContextFunction<T> {
  const fn = fromContext.bind(null, property) as ContextFunction<T>;
  fn.property = property;
  fn.eq = eq.bind(null, fn) as unknown as ComparatorSide<T>;
  fn.neq = neq.bind(null, fn) as unknown as ComparatorSide<T>;
  fn.lt = lt.bind(null, fn) as unknown as ComparatorSide<T>;
  fn.lte = lte.bind(null, fn) as unknown as ComparatorSide<T>;
  fn.gt = gt.bind(null, fn) as unknown as ComparatorSide<T>;
  fn.gte = gte.bind(null, fn) as unknown as ComparatorSide<T>;
  return fn;
}

export function ctxLogger(context: IContext): ILogger {
  return context.get<ILogger>(LOGGER_KEY);
}
