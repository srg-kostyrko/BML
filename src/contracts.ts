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

export interface IContext {
  get<T>(key: string): T;
  set<T>(key: string, value: T): void;

  fill(data: { [key: string]: any }): void;
  toJSON(): { [key: string]: any };
}

export type ContextGetter<T> = (context: IContext) => T;
export type ContextGetterArg<T> = ContextGetter<T> | T;

export type StreamInput = ArrayBuffer | DataView | Buffer;

export interface IStream {
  eof: boolean;
  finalize(): ArrayBuffer;

  read(type: DataType, endian?: Endian): number;

  write(type: DataType, value: number, endian?: Endian): void;

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

export interface ILogger {
  /**
   * Runtime errors that do not require immediate action but should typically
   * be logged and monitored.
   */
  error(...messages: any[]): void;

  /**
   * Exceptional occurrences that are not errors.
   *
   * Example: Use of deprecated APIs, poor use of an API, undesirable things
   * that are not necessarily wrong.
   */
  warn(...messages: any[]): void;

  /**
   * Interesting events.
   *
   * Example: User logs in, SQL logs.
   */
  info(...messages: any[]): void;

  /**
   * Detailed debug information.
   */
  debug(...messages: any[]): void;

  /**
   * Logs with an arbitrary level.
   */
  log(level: LogLevel, ...messages: any[]): void;
}
