class Context {
  constructor(parent) {
    this.parent = parent;
    this.data = new Map();
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
}

function ctx([property]) {
  return function fromContext(context) {
    return context.get(property);
  };
}

module.exports = {
  Context,
  ctx,
};
