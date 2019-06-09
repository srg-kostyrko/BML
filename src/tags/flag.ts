import { createAdapter } from './adapter';
import { byte } from './primitives';

export const flag = createAdapter(
  byte,
  (data: number): boolean => data !== 0,
  (data: boolean): number => (data ? 1 : 0)
);
