const { Logger } = require('./logger');

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

  toJson() {
    const parent = this.parent ? this.parent.toJson() : {};
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

function ctx([property]) {
  function fromContext(context) {
    return context.get(property);
  }
  fromContext.property = property;
  return fromContext;
}

function ctxLogger(context) {
  return context.get(LOGGER_KEY);
}

module.exports = {
  Context,
  ctx,
  ctxLogger,
};
