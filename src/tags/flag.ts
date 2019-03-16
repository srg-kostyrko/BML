import { createAdapter } from './adapter';
import { byte } from './primitives';

export const flag = createAdapter(
  byte,
  (data: number) => data !== 0,
  (data: boolean) => (data ? 1 : 0)
);
