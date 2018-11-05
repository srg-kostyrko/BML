class BMLError extends Error {}
class NotImplementedError extends BMLError {}
class TypeError extends BMLError {}
class SizeError extends BMLError {}

class ConstantError extends BMLError {}

module.exports = {
  BMLError,
  NotImplementedError,
  TypeError,
  SizeError,
  ConstantError,
};
