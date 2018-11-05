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
   *
   * @param string $message
   * @return void
   */
  error(message) {
    this.log(LOG_LEVELS.error, message);
  }

  /**
   * Exceptional occurrences that are not errors.
   *
   * Example: Use of deprecated APIs, poor use of an API, undesirable things
   * that are not necessarily wrong.
   *
   * @param string $message
   * @return void
   */
  warn(message) {
    this.log(LOG_LEVELS.warn, message);
  }

  /**
   * Interesting events.
   *
   * Example: User logs in, SQL logs.
   *
   * @param string $message
   * @return void
   */
  info(message) {
    this.log(LOG_LEVELS.info, message);
  }

  /**
   * Detailed debug information.
   *
   * @param string $message
   * @return void
   */
  debug(message) {
    this.log(LOG_LEVELS.debug, message);
  }

  /**
   * Logs with an arbitrary level.
   *
   * @param number level
   * @param string message
   * @return void
   */
  log(level, message) {
    switch (level) {
      case LOG_LEVELS.error:
        console.error(message); // eslint-disable-line no-console
        break;
      case LOG_LEVELS.warn:
        console.warn(message); // eslint-disable-line no-console
        break;
      case LOG_LEVELS.info:
        console.info(message); // eslint-disable-line no-console
        break;
      case LOG_LEVELS.verbose:
        console.log('[VERBOSE]', message); // eslint-disable-line no-console
        break;
      case LOG_LEVELS.debug:
        console.log('[DEBUG]', message); // eslint-disable-line no-console
        break;
      default:
        console.log(message); // eslint-disable-line no-console
    }
  }
}

module.exports = {
  LOG_LEVELS,
  Logger,
};
