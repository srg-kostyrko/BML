import { branch, int8, uint8, parse, pack } from '../../src';

describe('branch', () => {
  it('should use correct branch', () => {
    const testWhen = branch('1', { 0: int8, 1: uint8 });
    expect(parse(testWhen, new Int8Array([-56]))).toBe(200);
    expect(pack(testWhen, -56)).toEqual(new Int8Array([200]).buffer);
  });
});
