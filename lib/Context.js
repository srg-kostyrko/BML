const { Logger } = require('./logger');
const { functor } = require('./utils');

const LOGGER_KEY = '_logger_';

class Context {
  constructor(parent) {
    this.parent = parent;
    this.data = new Map();
    // for root context
    if (!parent) {
      this.set(LOGGER_KEY, new Logger());
    }
  }

  get(key) {
    if (this.data.has(key)) {
      return this.data.get(key);
    }
    if (this.parent) {
      return this.parent.get(key);
    }
    return null;
  }

  set(key, value) {
    this.data.set(key, value);
  }

  fill(data) {
    for (const [key, value] of Object.entries(data)) {
      this.data.set(key, value);
    }
  }

  toJSON() {
    const parent = this.parent ? this.parent.toJSON() : {};
    const json = {};
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

function fromContext(property, context) {
  return context.get(property);
}

const comparators = {
  eq: (left, right) => left === right,
  neq: (left, right) => left !== right,
  lt: (left, right) => left < right,
  lte: (left, right) => left <= right,
  gt: (left, right) => left > right,
  gte: (left, right) => left >= right,
};

function createComparator(name) {
  return function compare(left, right) {
    return function compareFn(context) {
      const leftFn = functor(left);
      const rightFn = functor(right);
      return comparators[name](leftFn(context), rightFn(context));
    };
  };
}

const eq = createComparator('eq');
const neq = createComparator('neq');
const lt = createComparator('lt');
const lte = createComparator('lte');
const gt = createComparator('gt');
const gte = createComparator('gte');

function ctx([property]) {
  const fn = fromContext.bind(null, property);
  fn.property = property;
  fn.eq = eq.bind(null, fn);
  fn.neq = neq.bind(null, fn);
  fn.lt = lt.bind(null, fn);
  fn.lte = lte.bind(null, fn);
  fn.gt = gt.bind(null, fn);
  fn.gte = gte.bind(null, fn);
  return fn;
}

function ctxLogger(context) {
  return context.get(LOGGER_KEY);
}

module.exports = {
  Context,
  ctx,
  ctxLogger,
};
