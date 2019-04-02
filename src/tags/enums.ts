import { Adapter } from './adapter';
import { createTag, TagOrWrapper, TagProducer } from './tag';

// Translates unicode label names to tag values, and vice versa.
class Enums extends Adapter<number, string | number> {
  private encodeMap: Map<string | number, number> = new Map();
  private decodeMap: Map<number, string | number> = new Map();

  public constructor(
    tag: TagOrWrapper<number>,
    map: string[] | { [key: string]: number } | Map<string | number, number>
  ) {
    super(tag);
    if (map instanceof Map) {
      for (const [key, value] of map.entries()) {
        this.encodeMap.set(key, value);
        this.decodeMap.set(value, key);
      }
    } else if (Array.isArray(map)) {
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

  public decode(data: number): string | number {
    const decoded = this.decodeMap.get(data);
    return decoded != null ? decoded : '';
  }

  public encode(data: string): number {
    return this.encodeMap.get(data) || 0;
  }
}

export function enums(
  subTag: TagOrWrapper<number>,
  map: string[] | { [key: string]: number } | Map<string | number, number>
): TagProducer<string | number> {
  return createTag(Enums, subTag, map);
}
