/**
 * Manages scanner event listeners.
 */
export default class ScannerEventHandler {
  /**
   * Initializes the event handler.
   */
  constructor() {
    this.eventListeners = new Set();
  }

  /**
   * @param {ScannerEventListener} eventListener The event listener to attach to the handler.
   */
  attach = (eventListener) => {
    this.eventListeners.add(eventListener);
  }

  /**
   * @param {ScannerEventListener} eventListener The event listener to detach from the handler.
   * @returns {boolean} Returns true if the event listener was detached successfully.
   */
  detach = (eventListener) => {
    if (!this.eventListeners.has(eventListener)) {
      return false;
    }
    this.eventListeners.delete(eventListener);
    return true;
  }

  /**
   * @param {ScannerEvent} event The event which has been emitted by the scanner.
   * @returns {Promise<undefined>}
   * @throws {Error}
   */
  notifyAllListeners = async (event) => {
    const notifyResults = [];

    this.eventListeners.forEach(async (listener) => {
      notifyResults.push(listener.notify(event));
    });

    // Forward occurring errors only, because there should be no return value from "notify"
    return Promise.all(notifyResults).then(() => {});
  }
}
