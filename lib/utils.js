function functor(value) {
  if (typeof value === 'function') {
    return value;
  }
  return () => value;
}

function range(size) {
  return Array.from({ length: size }, (_, i) => i);
}

function ensureTag(tag) {
  if (tag.isTagFn) {
    return tag();
  }
  return tag;
}

module.exports = {
  functor,
  range,
  ensureTag,
};
