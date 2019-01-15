import { parse, pack, when, int8, uint8 } from '../../src';

describe('when', () => {
  it('should use when tag if predicate is true', () => {
    const testWhen = when(() => true, int8, uint8)();
    expect(parse(testWhen, new Int8Array([-56]))).toBe(-56);
    expect(pack(testWhen, -56)).toEqual(new Int8Array([200]).buffer);
  });
  it('should use else tag if predicate is false', () => {
    const testWhen = when(() => false, int8, uint8)();
    expect(parse(testWhen, new Uint8Array([200]))).toBe(200);
    expect(pack(testWhen, 200)).toEqual(new Uint8Array([200]).buffer);
  });
});
