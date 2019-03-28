/**
 * @typedef {Object} ScannerEventPayload
 * @property {string} format
 * @property {string} code
 *
 * Defines an event which is emitted when the scanner scans something.
 */
export default class ScannerEvent {
  /**
   * @param {string} scope The scanner instance, that was running when this event was emitted.
   * @param {string} type The type of scanner that produced this result.
   * @param {ScannerEventPayload} payload The payload of the scan result.
   */
  constructor(scope, type, payload) {
    this.scope = scope;
    this.type = type;
    this.payload = payload;
  }

  /**
   * @returns {string}
   */
  getScope = () => this.scope;

  /**
   * @returns {string}
   */
  getType = () => this.type;

  /**
   * @returns {ScannerEventPayload}
   */
  getPayload = () => this.payload;
}
