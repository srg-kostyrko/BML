export enum DataType {
  int8,
  uint8,
  int16,
  uint16,
  int32,
  uint32,
  float32,
  float64,
}
export enum Endian {
  BE,
  LE,
}
export enum Encoding {
  ascii,
}

export interface Context {
  get<T>(key: string): T;
  set<T>(key: string, value: T): void;

  fill(data: Record<string, unknown>): void;
  toJSON(): Record<string, unknown>;
}

export type ContextGetter<T> = (context: Context) => T;
export type ContextGetterArg<T> = ContextGetter<T> | T;

export type StreamInput = ArrayBuffer | DataView | Buffer;

export interface Stream {
  eof: boolean;
  finalize(): ArrayBuffer;

  read(type: DataType, endian?: Endian): number;
  readBit(): number;

  write(type: DataType, value: number, endian?: Endian): void;
  writeBit(value: number): void;

  tell(): number;
  seek(offset: number): void;
  skip(offset: number): void;
}

export enum LogLevel {
  error,
  warn,
  info,
  verbose,
  debug,
  silly,
}

export interface Logger {
  /**
   * Runtime errors that do not require immediate action but should typically
   * be logged and monitored.
   */
  error(...messages: unknown[]): void;

  /**
   * Exceptional occurrences that are not errors.
   *
   * Example: Use of deprecated APIs, poor use of an API, undesirable things
   * that are not necessarily wrong.
   */
  warn(...messages: unknown[]): void;

  /**
   * Interesting events.
   *
   * Example: User logs in, SQL logs.
   */
  info(...messages: unknown[]): void;

  /**
   * Detailed debug information.
   */
  debug(...messages: unknown[]): void;

  /**
   * Logs with an arbitrary level.
   */
  log(level: LogLevel, ...messages: unknown[]): void;
}
