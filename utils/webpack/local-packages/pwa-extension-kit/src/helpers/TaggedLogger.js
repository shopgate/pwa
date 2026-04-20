import getConsole from './_getConsole';

const console = getConsole();
/**
 * Tagged Logger.
 * @link https://github.com/shopgate-professional-services/pwa-extension-kit/blob/master/helpers/README.md
 */
class TaggedLogger {
  /**
   * Instantiate TaggedLogger with given tag.
   * @param {string} tag Tag which will be appended to all logs.
   */
  constructor(tag) {
    this.tag = tag;
  }

  /**
   * Prints actual log.
   * @param {string} method Name of method (log, warn, error)
   */
  print(method, message, ...rest) {
    console[method](`[${this.tag}] ${message}`, ...rest);
  }

  /**
   * Prints tagged log.
   * @param {string} message Log message.
   */
  log(message, ...args) {
    this.print('log', message, ...args);
  }

  /**
   * Prints tagged warning.
   * @param {string} message Log message.
   */
  warn(message, ...args) {
    this.print('warn', message, ...args);
  }

  /**
   * Prints tagged error.
   * @param {string} message Log message.
   */
  error(message, ...args) {
    this.print('error', message, ...args);
  }
}

export default TaggedLogger;
