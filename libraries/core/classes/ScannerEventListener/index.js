import { logger } from '../../helpers';
import AppScanner from '../Scanner';

/**
 * Allows anyone to listen for scan results based on scope, type or both.
 */
class ScannerEventListener {
  /**
   * @param {string|null} name A name for the listener object to refer to.
   * @param {string|null} scope The scanner scope to listen for.
   * @param {string|null} type THe type of scanner events to listen for.
   */
  constructor(name = null, scope = null, type = null) {
    this.name = name || 'unnamed';
    this.scope = scope || null;
    this.type = type || null;
    this.handler = null;
  }

  /**
   * Callback for an instance of an event listener. It is expected to return no value on success.
   * Throw an Error() to force the scanner to restart.
   *
   * @callback ScannerEventListener~Handler
   * @param {ScannerEvent} event The event which is emitted, when something was scanned.
   * @returns {undefined|null} The return value is ignored. Returning a value will cause a warning.
   * @throws {Error} Throwing an error will cause the Scanner to restart and scan again.
   */
  /**
   * @param {Handler} handler The function which is called when a scan is done.
   * @returns {ScannerEventListener}
   */
  setHandler = (handler) => {
    if (typeof handler !== 'function') {
      logger.error(new Error('The ScannerEventListener handler must be a function!'));
    }

    this.handler = handler;
    return this;
  }

  /**
   * Attach the current event listener to the app scanner.
   */
  attach = () => {
    AppScanner.addListener(this);
  }

  /**
   * Checks the event to see, if the listener is interested in it and call it's handler.
   * @param {ScannerEvent} event The scanner event which was emitted.
   */
  notify = async (event) => {
    if (!this.handler) {
      logger.warn(`No event handler defined for eventListener "${this.name}"`);
      return;
    }

    // Skip handling if the events scope or type don't fit to the handler
    if (this.type && this.type !== event.type) {
      return;
    }
    if (this.scope && this.scope !== event.scope) {
      return;
    }

    // Call the listener which was previously registered
    const handlerResult = await this.handler(event);

    // Don't expect anything else than undefined or null
    if (handlerResult !== undefined && handlerResult !== null) {
      logger.warn(
        `Expected the ScannerEventListener::Handler "${this.name}" to return no value,`,
        `but it returned "${handlerResult}"`
      );
    }
  }
}

export default ScannerEventListener;
