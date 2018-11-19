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
const pointer = require('./pointer');
const seek = require('./seek');
const jump = require('./jump');
const pass = require('./pass');
const branch = require('./branch');
const computed = require('./computed');

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
  ...pointer,
  ...seek,
  ...jump,
  ...branch,
  ...pass,
  ...computed,
};
