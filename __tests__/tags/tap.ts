import { parse, byte, struct, tap, ctx } from '../../src';

describe('tap', () => {
  it('should dump whole context', () => {
    const testStruct = struct(byte`a`, byte`b`, tap())();

    const logger = {
      debug: jest.fn(),
    };

    parse(testStruct, new Uint8Array([5, 8]), {
      _logger_: logger,
    });

    expect(logger.debug).toBeCalledWith({
      a: 5,
      b: 8,
    });
  });

  it('should dump context property', () => {
    const testStruct = struct(byte`a`, byte`b`, tap(ctx`a`))();

    const logger = {
      debug: jest.fn(),
    };

    parse(testStruct, new Uint8Array([5, 8]), {
      _logger_: logger,
    });

    expect(logger.debug).toBeCalledWith(`a: `, 5);
  });
});
