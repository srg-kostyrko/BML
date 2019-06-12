import { Adapter } from './adapter';
import { createTag, TagOrWrapper, TagProducer } from './tag';

// Translates unicode label names to tag values, and vice versa.
class Enums<T extends Record<string, number>> extends Adapter<number, keyof T> {
  private encodeMap: Map<keyof T, number> = new Map();
  private decodeMap: Map<number, keyof T> = new Map();

  public constructor(tag: TagOrWrapper<number>, map: T) {
    super(tag);
    for (const [key, value] of Object.entries(map)) {
      this.encodeMap.set(key, value);
      this.decodeMap.set(value, key);
    }
  }

  public decode(data: number): keyof T {
    const decoded = this.decodeMap.get(data);
    return decoded != null ? decoded : '';
  }

  public encode(data: keyof T): number {
    return this.encodeMap.get(data) || 0;
  }
}

export function enums<T extends Record<string, number>>(
  subTag: TagOrWrapper<number>,
  map: T
): TagProducer<keyof T> {
  return createTag(Enums, subTag, map);
}
