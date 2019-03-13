import { Tag, createTag } from './tag';

class Pass extends Tag<null> {
  public parse(): null {
    // noop
    return null;
  }

  public pack(): void {
    // noop
  }
}

export const pass = createTag(Pass);
