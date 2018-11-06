const base = require('./base');
const primitives = require('./primitives');
const strings = require('./strings');
const enums = require('./enums');
const array = require('./array');
const sequence = require('./sequence');
const struct = require('./struct');
const constant = require('./constant');
const tap = require('./tap');
const when = require('./when');

module.exports = {
  ...base,
  ...primitives,
  ...strings,
  ...enums,
  ...array,
  ...sequence,
  ...struct,
  ...constant,
  ...tap,
  ...when,
};
