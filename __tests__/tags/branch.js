const { branch, int8, uint8 } = require('../../lib');

describe('branch', () => {
  it('should use correct branch', () => {
    const testWhen = branch(1, { 0: int8, 1: uint8 })();
    expect(testWhen.parse(new Int8Array([-56]))).toBe(200);
    expect(testWhen.pack(-56)).toEqual(new Int8Array([200]).buffer);
  });
});
