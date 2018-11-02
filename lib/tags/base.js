const { BMLStream } = require('../BMLStream');
const { Context } = require('../Context');
const { NotImplementedError } = require('../errors');

class BaseTag {
  constructor(name) {
    this.name = name;
  }

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

  withMeta(meta) {
    this.meta = meta;
    return this;
  }

  withDocs(docs) {
    this.docs = docs;
    return this;
  }

  toString() {
    return `${this.constructor.name} {
      ${this.name}
    }`;
  }
}

class CompositeTag extends BaseTag {
  constructor(name, subTags) {
    super(name);
    this.subTags = subTags;
  }
}

class Adapter extends BaseTag {
  constructor(name, tag) {
    super(name);
    this.tag = tag;
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

function createSimpleTag(TagClass) {
  const tagFn = function tag([name]) {
    return new TagClass(name);
  };
  tagFn.name = TagClass.constructor.name;
  return tagFn;
}

function createCompositeTag(TagClass) {
  const tagFn = function tag([name]) {
    return function tagComposite(...args) {
      return new TagClass(name, args);
    };
  };
  tagFn.name = TagClass.constructor.name;
  return tagFn;
}

function createTagWithArguments(TagClass) {
  const tagFn = function tag([name]) {
    return function tagWithArguments(...args) {
      return new TagClass(name, ...args);
    };
  };
  tagFn.name = TagClass.constructor.name;
  return tagFn;
}

module.exports = {
  BaseTag,
  CompositeTag,
  Adapter,
  createSimpleTag,
  createCompositeTag,
  createTagWithArguments,
};
