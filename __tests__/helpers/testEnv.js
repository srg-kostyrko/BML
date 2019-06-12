const NodeEnvironment = require('jest-environment-node'); // eslint-disable-line

class TestEnvironment extends NodeEnvironment {
  constructor(config) {
    super(
      Object.assign({}, config, {
        globals: Object.assign({}, config.globals, {
          Uint8Array: Uint8Array,
          Int8Array: Int8Array,
          ArrayBuffer: ArrayBuffer,
        }),
      })
    );
  }
}

module.exports = TestEnvironment;
