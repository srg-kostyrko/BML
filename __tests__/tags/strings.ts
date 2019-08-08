import { testTag } from '../helpers/tags';
import {
  string,
  pascalString,
  cString,
  greedyString,
  byte,
  parse,
  pack,
  Encoding,
} from '../../src';

describe('strings', () => {
  describe('string', () => {
    testTag(string(0)`empty`, [], '');
    testTag(string(4)`4 chars`, [82, 73, 77, 52], 'RIM4');
  });

  describe('pascalString', () => {
    const empty = pascalString(byte);
    expect(parse(empty, new Uint8Array([0]))).toBe('');
    expect(pack(empty, '')).toEqual(new Uint8Array([0]).buffer);

    const fourChars = pascalString(byte);
    expect(parse(fourChars, new Uint8Array([4, 82, 73, 77, 52]))).toBe('RIM4');
    expect(pack(fourChars, 'RIM4')).toEqual(
      new Uint8Array([4, 82, 73, 77, 52]).buffer
    );
  });

  describe('cString', () => {
    expect(parse(cString(), new Uint8Array([0]))).toBe('');
    expect(pack(cString(), '')).toEqual(new Uint8Array([0]).buffer);

    expect(parse(cString(), new Uint8Array([82, 73, 77, 52, 0]))).toBe('RIM4');
    expect(pack(cString(), 'RIM4')).toEqual(
      new Uint8Array([82, 73, 77, 52, 0]).buffer
    );
  });

  describe('greedy_string', () => {
    expect(parse(greedyString(), new Uint8Array([]))).toBe('');
    expect(pack(greedyString(), '')).toEqual(new Uint8Array([]).buffer);

    expect(parse(greedyString(), new Uint8Array([82, 73, 77, 52]))).toBe(
      'RIM4'
    );
    expect(pack(greedyString(), 'RIM4')).toEqual(
      new Uint8Array([82, 73, 77, 52]).buffer
    );
  });

  describe('utf8', () => {
    const UTF8_RANGES_BYTE_ARRAY = [
      0x00,
      0x7f,
      0xc2,
      0x80,
      0xdf,
      0xbf,
      0xe0,
      0xa0,
      0x80,
      0xef,
      0xbf,
      0xbf,
    ];

    const UTF8_SURROGATE_PAIR_RANGES_BYTE_ARRAY = [
      0xf0,
      0x90,
      0x80,
      0x80, // \uD800\uDC00
      0xf0,
      0x90,
      0x8f,
      0xbf, // \uD800\uDFFF
      0xf4,
      0x8f,
      0xb0,
      0x80, // \uDBFF\uDC00
      0xf4,
      0x8f,
      0xbf,
      0xbf, // \uDBFF\uDFFF
    ];

    const UTF8_RANGES_STRING = '\u0000\u007F\u0080\u07FF\u0800\uFFFF';

    const UTF8_SURROGATE_PAIR_RANGES_STRING =
      '\uD800\uDC00\uD800\uDFFF\uDBFF\uDC00\uDBFF\uDFFF';

    testTag(
      string(12, Encoding.utf8)`utf8 ascii`,
      [72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100],
      'Hello, world'
    );
    testTag(
      string(6, Encoding.utf8)`utf8 latin`,
      [83, 99, 104, 195, 182, 110],
      'Sch\u00f6n'
    );
    testTag(
      string(
        UTF8_RANGES_BYTE_ARRAY.length,
        Encoding.utf8
      )`utf8 limits of the first 3 UTF-8 character ranges`,
      UTF8_RANGES_BYTE_ARRAY,
      UTF8_RANGES_STRING
    );
    testTag(
      string(
        UTF8_SURROGATE_PAIR_RANGES_BYTE_ARRAY.length,
        Encoding.utf8
      )`utf8 Surrogate Pair`,
      UTF8_SURROGATE_PAIR_RANGES_BYTE_ARRAY,
      UTF8_SURROGATE_PAIR_RANGES_STRING
    );
  });

  describe('utf16be', () => {
    testTag(
      string(16, Encoding.utf16be)`Consecutive astral symbols`,
      [216, 60, 223, 85, 216, 53, 220, 0, 216, 52, 223, 6, 216, 52, 223, 86],
      '\uD83C\uDF55\uD835\uDC00\uD834\uDF06\uD834\uDF56'
    );
    testTag(
      string(
        6,
        Encoding.utf16be
      )`U+D800 (high surrogate) followed by non-surrogates`,
      [216, 0, 0, 97, 0, 98],
      '\uD800ab'
    );
    testTag(
      string(
        6,
        Encoding.utf16be
      )`U+DC00 (low surrogate) followed by non-surrogates`,
      [220, 0, 0, 97, 0, 98],
      '\uDC00ab'
    );
    testTag(
      string(
        4,
        Encoding.utf16be
      )`High surrogate followed by another high surrogate`,
      [216, 0, 216, 0],
      '\uD800\uD800'
    );
    testTag(
      string(
        8,
        Encoding.utf16be
      )`Unmatched high surrogate, followed by a surrogate pair, followed by an unmatched high surrogate`,
      [216, 0, 216, 52, 223, 6, 216, 0],
      '\uD800\uD834\uDF06\uD800'
    );
    testTag(
      string(
        4,
        Encoding.utf16be
      )`Low surrogate followed by another low surrogate`,
      [220, 0, 220, 0],
      '\uDC00\uDC00'
    );
    testTag(
      string(
        8,
        Encoding.utf16be
      )`Unmatched low surrogate, followed by a surrogate pair, followed by an unmatched low surrogate`,
      [220, 0, 216, 52, 223, 6, 220, 0],
      '\uDC00\uD834\uDF06\uDC00'
    );
  });

  describe('utf16le', () => {
    testTag(
      string(16, Encoding.utf16le)`Consecutive astral symbols`,
      [60, 216, 85, 223, 53, 216, 0, 220, 52, 216, 6, 223, 52, 216, 86, 223],
      '\uD83C\uDF55\uD835\uDC00\uD834\uDF06\uD834\uDF56'
    );
    testTag(
      string(
        6,
        Encoding.utf16le
      )`U+D800 (high surrogate) followed by non-surrogates`,
      [0, 216, 97, 0, 98, 0],
      '\uD800ab'
    );
    testTag(
      string(
        6,
        Encoding.utf16le
      )`U+DC00 (low surrogate) followed by non-surrogates`,
      [0, 220, 97, 0, 98, 0],
      '\uDC00ab'
    );
    testTag(
      string(
        4,
        Encoding.utf16le
      )`High surrogate followed by another high surrogate`,
      [0, 216, 0, 216],
      '\uD800\uD800'
    );
    testTag(
      string(
        8,
        Encoding.utf16le
      )`Unmatched high surrogate, followed by a surrogate pair, followed by an unmatched high surrogate`,
      [0, 216, 52, 216, 6, 223, 0, 216],
      '\uD800\uD834\uDF06\uD800'
    );
    testTag(
      string(
        4,
        Encoding.utf16le
      )`Low surrogate followed by another low surrogate`,
      [0, 220, 0, 220],
      '\uDC00\uDC00'
    );
    testTag(
      string(
        8,
        Encoding.utf16le
      )`Unmatched low surrogate, followed by a surrogate pair, followed by an unmatched low surrogate`,
      [0, 220, 52, 216, 6, 223, 0, 220],
      '\uDC00\uD834\uDF06\uDC00'
    );
  });
});
