const { BMLStream } = require('../BMLStream');
const { Context } = require('../Context');
const { NotImplementedError } = require('../errors');
const { ensureTag } = require('../utils');

class BaseTag {
  parse(data) {
    const stream = new BMLStream(data);
    const context = new Context();
    return this._parse_(stream, context);
  }

  _parse_(_stream, _context) {
    throw new NotImplementedError(
      `_parse_ is not implemented in ${this.constructor.name}`
    );
  }

  pack(data) {
    const stream = new BMLStream();
    const context = new Context();
    this._pack_(stream, data, context);
    return stream.finalize();
  }

  _pack_(_stream, _data, _context) {
    throw new NotImplementedError(
      `_parse_ is not implemented in ${this.constructor.name}`
    );
  }

  named(name) {
    this.name = name;
    return this;
  }

  toString() {
    return `${this.constructor.name} {
      ${this.name}
    }`;
  }
}

class CompositeTag extends BaseTag {
  constructor(...subTags) {
    super();
    this.subTags = subTags.map(ensureTag);
  }
}

class Adapter extends BaseTag {
  constructor(tag) {
    super();
    this.tag = ensureTag(tag);
  }

  _parse_(stream, context) {
    const data = this.tag._parse_(stream, context);
    return this._decode_(data, context);
  }

  _pack_(stream, data, context) {
    const encoded = this._encode_(data, context);
    this.tag._pack_(stream, encoded, context);
  }

  _decode_(_data, _context) {
    throw new NotImplementedError(
      `_parse_ is not implemented in ${this.constructor.name}`
    );
  }

  _encode_(_data, _context) {
    throw new NotImplementedError(
      `_parse_ is not implemented in ${this.constructor.name}`
    );
  }
}

function createNamedTag(TagClass, name) {
  const tagFn = function tagFn(...args) {
    return new TagClass(...args).named(name);
  };
  Object.defineProperty(tagFn, 'name', { value: TagClass.name.toLowerCase() });
  Object.defineProperty(tagFn, 'isTagFn', { get: () => true });
  return tagFn;
}

function createTag(TagClass) {
  const tagFn = function tagFn(...args) {
    if (args.length > 0 && args[0].raw) {
      // used as template literal -> translate into named tag
      return createNamedTag(TagClass, args[0][0]);
    }
    return new TagClass(...args);
  };
  Object.defineProperty(tagFn, 'name', { value: TagClass.name.toLowerCase() });
  Object.defineProperty(tagFn, 'isTagFn', { get: () => true });
  return tagFn;
}

module.exports = {
  BaseTag,
  CompositeTag,
  Adapter,
  createTag,
};
