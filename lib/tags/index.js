const base = require('./base');
const primitives = require('./primitives');
const strings = require('./strings');
const enums = require('./enums');
const array = require('./array');
const sequence = require('./sequence');
const struct = require('./struct');

module.exports = {
  ...base,
  ...primitives,
  ...strings,
  ...enums,
  ...array,
  ...sequence,
  ...struct,
};
