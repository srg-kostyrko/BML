import { testTag } from '../helpers/tags';
import {
  string,
  pascalString,
  cString,
  greedyString,
  byte,
  parse,
  pack,
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
});
