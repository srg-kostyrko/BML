class ENDIAN {
  static get BE() {
    return 0;
  }

  static get LE() {
    return 1;
  }
}

class ENCODING {
  static get ASCII() {
    return 'ascii';
  }
}

const ENDIAN_KEY = '_endian_';
const LOGGER_KEY = '_logger_';
const ENCODING_KEY = '_encoding_';

module.exports = {
  ENDIAN,
  ENCODING,
  ENDIAN_KEY,
  LOGGER_KEY,
  ENCODING_KEY,
};
