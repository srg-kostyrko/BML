const base = require('./base');
const primitives = require('./primitives');
const enums = require('./enums');
const array = require('./array');
const sequence = require('./sequence');
const struct = require('./struct');

module.exports = {
  ...base,
  ...primitives,
  ...enums,
  ...array,
  ...sequence,
  ...struct,
};
