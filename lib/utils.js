function functor(value) {
  if (typeof value === 'function') {
    return value;
  }
  return () => value;
}

function range(size) {
  return Array.from({ length: size }, (_, i) => i);
}

module.exports = {
  functor,
  range,
};
