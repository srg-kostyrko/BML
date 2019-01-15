import { IContext } from '../contracts';

import { Adapter } from './adapter';
import { createTag, TagOrWrapper } from './tag';

// Translates unicode label names to tag values, and vice versa.
class Enums extends Adapter<number, string> {
  encodeMap: Map<string, number>;
  decodeMap: Map<number, string>;

  constructor(
    tag: TagOrWrapper<number>,
    map: string[] | { [key: string]: number }
  ) {
    super(tag);
    this.encodeMap = new Map();
    this.decodeMap = new Map();
    if (Array.isArray(map)) {
      for (const [value, key] of map.entries()) {
        this.encodeMap.set(key, value);
        this.decodeMap.set(value, key);
      }
    } else {
      for (const [key, value] of Object.entries(map)) {
        this.encodeMap.set(key, value);
        this.decodeMap.set(value, key);
      }
    }
  }

  decode(data: number, context: IContext) {
    return this.decodeMap.get(data) || '';
  }

  encode(data: string, context: IContext) {
    return this.encodeMap.get(data) || 0;
  }
}

export function enums(
  subTag: TagOrWrapper<number>,
  map: string[] | { [key: string]: number }
) {
  return createTag(Enums, subTag, map);
}
