const { BMLStream } = require('../BMLStream');
const { Context } = require('../context');
const { NotImplementedError } = require('../errors');
const { ensureTag } = require('../utils');

function prepareContext(contextData) {
  let context = new Context();
  if (contextData) {
    if (contextData instanceof Context) {
      context = contextData;
    } else {
      context.fill(contextData);
    }
  }
  return context;
}

class Tag {
  parse(data, contextData = {}) {
    const stream = new BMLStream(data);
    const context = prepareContext(contextData);
    return this._parse_(stream, context);
  }

  _parse_(_stream, _context) {
    throw new NotImplementedError(
      `_parse_ is not implemented in ${this.constructor.name}`
    );
  }

  pack(data, contextData = {}) {
    const stream = new BMLStream();
    const context = prepareContext(contextData);
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

class CompositeTag extends Tag {
  constructor(...subTags) {
    super();
    this.subTags = subTags.map(ensureTag);
  }
}

class Adapter extends Tag {
  constructor(subTag) {
    super();
    this.tag = ensureTag(subTag);
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
      `_decode_ is not implemented in ${this.constructor.name}`
    );
  }

  _encode_(_data, _context) {
    throw new NotImplementedError(
      `_encode_ is not implemented in ${this.constructor.name}`
    );
  }
}

function markTagFn(fn) {
  Object.defineProperty(fn, 'isTagFn', { get: () => true });
}

function tag(TagClass, args = []) {
  const tagFn = function tagFn(input) {
    let name;
    if (typeof input === 'string') {
      name = input; // calling tag with name as usual function
    } else if (Array.isArray(input) && input.raw) {
      [name] = input; // calling tag as template fn
    }
    function builderFn() {
      return new TagClass(...args).named(name);
    }
    markTagFn(builderFn);
    if (input === undefined) {
      return builderFn();
    }
    return builderFn;
  };
  Object.defineProperty(tagFn, 'name', {
    value: TagClass.name.toLowerCase(),
  });
  markTagFn(tagFn);
  return tagFn;
}

function tagWithParams(TagClass) {
  const tagParamFn = function tagParamFn(...args) {
    return tag(TagClass, args);
  };
  Object.defineProperty(tagParamFn, 'isTagFn', {
    get: () => {
      throw new Error(`params not passed for ${TagClass.name}`);
    },
  });
  return tagParamFn;
}

module.exports = {
  Tag,
  CompositeTag,
  Adapter,
  tag,
  tagWithParams,
};
