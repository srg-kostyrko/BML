import { Logger as ILogger, LogLevel } from './contracts';

export class Logger implements ILogger {
  public error(...messages: unknown[]): void {
    this.log(LogLevel.error, ...messages);
  }

  public warn(...messages: unknown[]): void {
    this.log(LogLevel.warn, ...messages);
  }

  public info(...messages: unknown[]): void {
    this.log(LogLevel.info, ...messages);
  }

  public debug(...messages: unknown[]): void {
    this.log(LogLevel.debug, ...messages);
  }

  public log(level: LogLevel, ...messages: unknown[]): void {
    switch (level) {
      case LogLevel.error:
        console.error(...messages);
        break;
      case LogLevel.warn:
        console.warn(...messages);
        break;
      case LogLevel.info:
        console.info(...messages);
        break;
      case LogLevel.verbose:
        console.log('[VERBOSE]', ...messages);
        break;
      case LogLevel.debug:
        console.log('[DEBUG]', ...messages);
        break;
      default:
        console.log(...messages);
    }
  }
}
