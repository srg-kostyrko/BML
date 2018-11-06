const { pointer, byte } = require('../../lib');

describe('pointer', () => {
  it('should navigate stream correctly', () => {
    const testPointer = pointer(3, byte)();
    expect(testPointer.parse(new Uint8Array([0, 0, 0, 1, 0]))).toBe(1);

    expect(testPointer.pack(1)).toEqual(new Uint8Array([0, 0, 0, 1]).buffer);
  });
});
