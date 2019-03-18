import { Adapter } from './adapter';
import { createTag, TagOrWrapper, TagProducer } from './tag';

// Translates unicode label names to tag values, and vice versa.
class Enums extends Adapter<number, string> {
  private encodeMap: Map<string, number> = new Map();
  private decodeMap: Map<number, string> = new Map();

  public constructor(
    tag: TagOrWrapper<number>,
    map: string[] | { [key: string]: number }
  ) {
    super(tag);
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

  public decode(data: number): string {
    return this.decodeMap.get(data) || '';
  }

  public encode(data: string): number {
    return this.encodeMap.get(data) || 0;
  }
}

export function enums(
  subTag: TagOrWrapper<number>,
  map: string[] | { [key: string]: number }
): TagProducer<string> {
  return createTag(Enums, subTag, map);
}
