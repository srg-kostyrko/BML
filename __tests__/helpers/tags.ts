import { parse, pack, TagOrWrapper } from '../../src';

export function testTag<T>(
  tag: TagOrWrapper<T>,
  binarySample: number[],
  dataSample: any
) {
  const binaryData = new Uint8Array(binarySample);
  describe(tag.name || tag.constructor.name, () => {
    test('parse', () => {
      const parsed = parse(tag, binaryData);
      expect(parsed).toEqual(dataSample);
    });
    test('pack', () => {
      const packed = pack(tag, dataSample);
      expect(packed).toEqual(binaryData.buffer);
    });
  });
}