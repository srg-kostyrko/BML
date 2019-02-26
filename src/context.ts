import {
  IContext,
  ContextGetterArg,
  ContextGetter,
  ILogger,
} from './contracts';
import { LOGGER_KEY } from './constants';
import { Logger } from './logger';

export class Context implements IContext {
  parent: IContext | undefined;
  data: Map<string, any>;

  constructor(parent?: IContext) {
    this.parent = parent;
    this.data = new Map();
    // for root context
    if (!parent) {
      this.set(LOGGER_KEY, new Logger());
    }
  }

  get<T>(key: string): T {
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
    if (!path.length) return value;

    let index = 0;
    while (value != null && index < path.length) {
      value = value[path[index]];
      index += 1;
    }

    return value;
  }

  set(key: string, value: any) {
    const [topKey, ...path] = key.split('.');
    if (path.length) {
      let object = this.data.get(topKey) || {};
      const topObject = object;
      let index = 0;
      while (index < path.length - 1) {
        object[path[index]] = object[path[index]] || {};
        object = object[path[index]];
        index += 1;
      }
      object[path[index]] = value;
      this.data.set(topKey, topObject);
    } else {
      this.data.set(key, value);
    }
  }

  fill(data: { [key: string]: any }) {
    for (const [key, value] of Object.entries(data)) {
      this.data.set(key, value);
    }
  }

  toJSON(): { [key: string]: any } {
    const parent = this.parent ? this.parent.toJSON() : {};
    const json: { [key: string]: any } = {};
    this.data.forEach((value, key) => {
      if (key === LOGGER_KEY) return;
      json[key] = value;
    });

    return {
      ...parent,
      ...json,
    };
  }
}

function fromContext<T>(property: string, context: IContext) {
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
  [Comparator.eq]: (left: any, right: any): boolean => left === right,
  [Comparator.neq]: (left: any, right: any): boolean => left !== right,
  [Comparator.lt]: (left: any, right: any): boolean => left < right,
  [Comparator.lte]: (left: any, right: any): boolean => left <= right,
  [Comparator.gt]: (left: any, right: any): boolean => left > right,
  [Comparator.gte]: (left: any, right: any): boolean => left >= right,
};

function createComparator(type: Comparator) {
  return function compare<T>(left: T, right: T) {
    return function compareFn(context: IContext) {
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

export interface IContextFunction<T> {
  (context: IContext): T;
  property: string;
  eq: ComparatorSide<T>;
  neq: ComparatorSide<T>;
  lt: ComparatorSide<T>;
  lte: ComparatorSide<T>;
  gt: ComparatorSide<T>;
  gte: ComparatorSide<T>;
}

export function ctx<T>([property]: TemplateStringsArray): IContextFunction<T> {
  const fn = fromContext.bind(null, property) as IContextFunction<T>;
  fn.property = property;
  fn.eq = (eq.bind(null, fn) as unknown) as ComparatorSide<T>;
  fn.neq = (neq.bind(null, fn) as unknown) as ComparatorSide<T>;
  fn.lt = (lt.bind(null, fn) as unknown) as ComparatorSide<T>;
  fn.lte = (lte.bind(null, fn) as unknown) as ComparatorSide<T>;
  fn.gt = (gt.bind(null, fn) as unknown) as ComparatorSide<T>;
  fn.gte = (gte.bind(null, fn) as unknown) as ComparatorSide<T>;
  return fn;
}

export function ctxLogger(context: IContext) {
  return context.get<ILogger>(LOGGER_KEY);
}

export function createContextGetter<T>(
  input: ContextGetterArg<T>
): ContextGetter<T> {
  if (typeof input === 'function') {
    return input as ContextGetter<T>;
  }
  return (context: IContext) => input;
}
