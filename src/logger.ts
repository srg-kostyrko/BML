import { ILogger, LogLevel } from './contracts';

export class Logger implements ILogger {
  error(...messages: any[]) {
    this.log(LogLevel.error, ...messages);
  }

  warn(...messages: any[]) {
    this.log(LogLevel.warn, ...messages);
  }

  info(...messages: any[]) {
    this.log(LogLevel.info, ...messages);
  }

  debug(...messages: any[]) {
    this.log(LogLevel.debug, ...messages);
  }

  log(level: LogLevel, ...messages: any[]) {
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
