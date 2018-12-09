const LOG_LEVELS = Object.freeze({
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
  silly: 5,
});

class Logger {
  /**
   * Runtime errors that do not require immediate action but should typically
   * be logged and monitored.
   */
  error(...messages) {
    this.log(LOG_LEVELS.error, ...messages);
  }

  /**
   * Exceptional occurrences that are not errors.
   *
   * Example: Use of deprecated APIs, poor use of an API, undesirable things
   * that are not necessarily wrong.
   */
  warn(...messages) {
    this.log(LOG_LEVELS.warn, ...messages);
  }

  /**
   * Interesting events.
   *
   * Example: User logs in, SQL logs.
   */
  info(...messages) {
    this.log(LOG_LEVELS.info, ...messages);
  }

  /**
   * Detailed debug information.
   */
  debug(...messages) {
    this.log(LOG_LEVELS.debug, ...messages);
  }

  /**
   * Logs with an arbitrary level.
   */
  log(level, ...messages) {
    switch (level) {
      case LOG_LEVELS.error:
        console.error(...messages); // eslint-disable-line no-console
        break;
      case LOG_LEVELS.warn:
        console.warn(...messages); // eslint-disable-line no-console
        break;
      case LOG_LEVELS.info:
        console.info(...messages); // eslint-disable-line no-console
        break;
      case LOG_LEVELS.verbose:
        console.log('[VERBOSE]', ...messages); // eslint-disable-line no-console
        break;
      case LOG_LEVELS.debug:
        console.log('[DEBUG]', ...messages); // eslint-disable-line no-console
        break;
      default:
        console.log(...messages); // eslint-disable-line no-console
    }
  }
}

module.exports = {
  LOG_LEVELS,
  Logger,
};
