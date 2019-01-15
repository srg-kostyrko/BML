import { pointer, byte, parse, pack } from '../../src';

describe('pointer', () => {
  it('should navigate stream correctly', () => {
    const testPointer = pointer(3, byte);
    expect(parse(testPointer, new Uint8Array([0, 0, 0, 1, 0]))).toBe(1);

    expect(pack(testPointer, 1)).toEqual(new Uint8Array([0, 0, 0, 1]).buffer);
  });
});
