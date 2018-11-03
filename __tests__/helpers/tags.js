function testTag(tag, binarySample, dataSample, size) {
  const binaryData = new Uint8Array(binarySample);
  describe(tag.name || tag.constructor.name, () => {
    test('parse', () => {
      const parsed = tag.parse(binaryData);
      expect(parsed).toEqual(dataSample);
    });
    test('pack', () => {
      const packed = tag.pack(dataSample);
      expect(packed).toEqual(binaryData.buffer);
    });
    test('size', () => {
      expect(tag.size()).toBe(size);
    });
  });
}

module.exports = {
  testTag,
};
