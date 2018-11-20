const { Tag, Adapter, tagWithParams } = require('./base');
const { UINT8 } = require('../types');
const { functor, ensureTag } = require('../utils');

class StringEncoder extends Adapter {
  constructor(subTag, encoding) {
    super(subTag);
    this.encoding = encoding;
  }

  getEncoding(context) {
    if (this.encoding) {
      return this.encoding;
    }
    return context.get('_encoding_') || 'ascii';
  }

  _decode_(data, context) {
    this.getEncoding(context); // TODO add different encoding support
    return String.fromCharCode(...data);
  }

  _encode_(data, context) {
    this.getEncoding(context); // TODO add different encoding support
    return data.split('').map(char => char.charCodeAt(0));
  }
}

const string_encoder = tagWithParams(StringEncoder);

class StringReader extends Tag {
  constructor(length, primitive = UINT8) {
    super();
    this.length = functor(length);
    this.primitive = primitive;
  }

  _parse_(stream, context) {
    let count = this.length(context);
    const result = [];
    while (count > 0) {
      result.push(stream.read(this.primitive));
      count -= 1;
    }
    return result;
  }

  _pack_(stream, data, context) {
    const count = this.length(context);
    let i = 0;
    while (i < count) {
      stream.write(this.primitive, data[i] || 0);
      i += 1;
    }
  }
}

const string_reader = tagWithParams(StringReader);

class PascalStringReader extends Tag {
  constructor(lengthTag, primitive = UINT8) {
    super();
    this.lengthTag = ensureTag(lengthTag);
    this.primitive = primitive;
  }

  _parse_(stream, context) {
    let count = this.lengthTag._parse_(stream, context);
    const result = [];
    while (count > 0) {
      result.push(stream.read(this.primitive));
      count -= 1;
    }
    return result;
  }

  _pack_(stream, data, context) {
    this.lengthTag._pack_(stream, data.length, context);
    for (const dataPart of data) {
      stream.write(this.primitive, dataPart);
    }
  }
}

const pascal_string_reader = tagWithParams(PascalStringReader);

class CStringReader extends Tag {
  constructor(primitive = UINT8) {
    super();
    this.primitive = primitive;
  }

  _parse_(stream, _context) {
    const result = [];
    while (!stream.eof) {
      const data = stream.read(this.primitive);
      if (data === 0) {
        break;
      }
      result.push(data);
    }
    return result;
  }

  _pack_(stream, data, _context) {
    for (const dataPart of data) {
      stream.write(this.primitive, dataPart);
    }
    stream.write(this.primitive, 0);
  }
}

const c_string_reader = tagWithParams(CStringReader);

class GreedyStringReader extends Tag {
  constructor(primitive = UINT8) {
    super();
    this.primitive = primitive;
  }

  _parse_(stream, _context) {
    const result = [];
    while (!stream.eof) {
      const data = stream.read(this.primitive);
      result.push(data);
    }
    return result;
  }

  _pack_(stream, data, _context) {
    for (const dataPart of data) {
      stream.write(this.primitive, dataPart);
    }
  }
}

const greedy_string_reader = tagWithParams(GreedyStringReader);

module.exports = {
  string_encoder,
  string_reader,
  pascal_string_reader,
  c_string_reader,
  greedy_string_reader,
  string: function string(length, encoding) {
    return string_encoder(string_reader(length), encoding);
  },
  pascal_string: function pascal_string(lengthTag, encoding) {
    return string_encoder(pascal_string_reader(lengthTag), encoding);
  },
  c_string: function c_string(encoding) {
    return string_encoder(c_string_reader(), encoding);
  },
  greedy_string: function greedy_string(encoding) {
    return string_encoder(greedy_string_reader(), encoding);
  },
};
