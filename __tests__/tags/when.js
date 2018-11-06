const { when, int8, uint8 } = require('../../lib');

describe('when', () => {
  it('should use when tag if predicate is true', () => {
    const testWhen = when(true, int8, uint8)();
    expect(testWhen.parse(new Int8Array([-56]))).toBe(-56);
    expect(testWhen.pack(-56)).toEqual(new Int8Array([200]).buffer);
  });
  it('should use else tag if predicate is true', () => {
    const testWhen = when(false, int8, uint8)();
    expect(testWhen.parse(new Uint8Array([200]))).toBe(200);
    expect(testWhen.pack(200)).toEqual(new Uint8Array([200]).buffer);
  });
});
