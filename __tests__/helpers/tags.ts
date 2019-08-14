import * as fs from 'fs';
import { parse, pack, TagOrWrapper } from '../../src';

export function testTag<T>(
  tag: TagOrWrapper<T>,
  binarySample: number[],
  dataSample: unknown
): void {
  const binaryData = new Uint8Array(binarySample);
  describe(tag.name || tag.constructor.name, () => {
    test('parse', () => {
      const parsed = parse(tag, binaryData);
      expect(parsed).toEqual(dataSample);
    });
    test('pack', () => {
      const packed = pack(tag, dataSample);
      expect(new Uint8Array(packed)).toEqual(binaryData);
    });
  });
}

export function testFile<T>(
  filePath: string,
  tag: TagOrWrapper<T>,
  description: string
): void {
  const content = fs.readFileSync(filePath);
  const parseResult = parse(tag, content);
  expect(parseResult).toMatchSnapshot(description);
}
