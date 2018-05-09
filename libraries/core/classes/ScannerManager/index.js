import { logger } from '../../helpers';
import event from '../../classes/Event';

import registerEvents from '../../commands/registerEvents';
import broadcastEvent from '../../commands/broadcastEvent';

import {
  SCANNER_MODE_ON,
  SCANNER_TYPE_BARCODE,
  SCANNER_TYPE_IMAGE,
} from '../../constants/Scanner';

import {
  openScanner,
  closeScanner,
  startScanner,
} from '../../commands/scanner';

const APP_EVENT_SCANNER_DID_SCAN = 'scannerDidScan';
const APP_EVENT_SCANNER_DID_CAPTURE_IMAGE = 'scannerDidCaptureImage';
const APP_EVENT_SCANNER_RESULT_PROCESSED = 'scannerResultProcessed';
const APP_EVENT_CLOSE_SCANNER = 'closeScanner';
const APP_EVENT_SCANNER_ERROR_CLOSED = 'scannerErrorClosed';

registerEvents([
  APP_EVENT_SCANNER_ERROR_CLOSED,
  APP_EVENT_SCANNER_DID_SCAN,
  APP_EVENT_SCANNER_DID_CAPTURE_IMAGE,
  APP_EVENT_CLOSE_SCANNER,
]);

/**
 * The payload of a "scannerDidScan" app event.
 * @typedef {Object} ScannerDidScanPayload
 * @property {string} format The format of the scanned content. Possible values are: UPC_E, CODE_39,
 *   EAN_13, EAN_8, CODE_93, CODE_128 PDF_417, QR_CODE, AZTEC, ITF and DATA_MATRIX.
 * @property {string} code The code that has been scanned.
 */

/**
 * A callback that is invoked whenever the scanner recognized supported content.
 * @callback scanHandlerCallback
 * @param {ScannerDidScanPayload} data The event payload.
 */

/**
 * The ScannerManager class. It's intendend to simplify the processes that are necessary to
 * programmatically interact with the scanner feature of the app. It provides the possiblity to
 * register a handler callback to process the scanned barcode / qr code payload.
 */
class ScannerManager {
  /**
   * The ScannerManager constructor.
   * @param {Object} options Options for the ScannerManager.
   * @param {boolean} [options.autoClose=true] If set to TRUE, the app scanner will close
   *  automatically after a successful scan.
   */
  constructor(options = {}) {
    this.autoClose = options.autoClose || true;

    this.scanHandlerCallback = () => {};

    this.supportedTypes = [SCANNER_TYPE_BARCODE, SCANNER_TYPE_IMAGE];

    /**
     * Create references to the app event handler fuctions. They preserve the "this" context of
     * a ScannerManager instance and can be used to register and unregister event listeners.
     */
    this.scannerDidScanCallback = this.scannerDidScanCallback.bind(this);
    this.closeScanner = this.closeScanner.bind(this);
  }

  /**
   * The internal handler for the "scannerDidScan" app event.
   * @private
   * @param {ScannerDidScanPayload} payload The event payload.
   */
  scannerDidScanCallback(payload) {
    /**
     * Trigger an ad scanner result processed event to inform the scanner view
     * about the outcome of the scan.
     * @param {string} requestId The id of the scanner request.
     * @param {boolean} [success=true] Tells if processing was successful.
     * @param {Object|null} message An object that contains properties for a dialog popup.
     */
    const scannerResultProcessedEvent = (requestId, success = true, message = null) => {
      broadcastEvent({
        event: APP_EVENT_SCANNER_RESULT_PROCESSED,
        parameters: [requestId, success, message],
      });
    };

    /**
     * Wrapper function to enable execution of async code within an EventEmitter callback.
     */
    const execScanCallback = async () => {
      const { requestId } = payload;
      try {
        // Invoke the callback.
        await this.scanHandlerCallback(payload);
        scannerResultProcessedEvent(requestId);
        if (this.autoClose) {
          // Close the scanner after a successful scan.
          this.closeScanner();
        }
      } catch (error) {
        const { message, title = null } = error;
        // Trigger an error message within the app scanner webview. When content processing failed.
        scannerResultProcessedEvent(requestId, false, {
          message,
          title,
        });
      }
    };

    execScanCallback();
  }

  /**
   * Register a callback to handle scanned content. Errors that are thrown inside will be displayed
   * to the user as a notification, so that the webview can stay open for further scan attempts.
   * It's recommended to use the ScannerError for that purpose, since it provides the possiblity
   * to set a message and a title for the notification.
   * @param {scanHandlerCallback} callback The callback - async functions are supported.
   * @return {ScannerManager}
   */
  registerScanHandler(callback) {
    if (typeof callback === 'function') {
      this.scanHandlerCallback = callback;
    }

    return this;
  }

  /**
   * Open the scanner webview. It will instantly start the scanning process.
   * @param {string} type The initially activated scanner type.
   * @return {ScannerManager}
   */
  openScanner(type = SCANNER_TYPE_BARCODE) {
    if (!this.supportedTypes.includes(type)) {
      logger.error(`Scanner opening failed. ${type} is a not supported scanner type.`);
      return this;
    }

    // Add a listener to the closeScanner event to react on a close button press in the scanner.
    event.addListener(APP_EVENT_CLOSE_SCANNER, this.closeScanner);
    // Add a listener to the scannerDidScan event to process scanner data.
    event.addListener(APP_EVENT_SCANNER_DID_SCAN, this.scannerDidScanCallback);
    event.addListener(APP_EVENT_SCANNER_DID_CAPTURE_IMAGE, this.scannerDidScanCallback);
    // Add a listener to restart the scanner recognition after the user accepted the notification.
    event.addListener(APP_EVENT_SCANNER_ERROR_CLOSED, startScanner);
    // Open the scanner webview.
    openScanner({ modes: { [type]: SCANNER_MODE_ON } });
    return this;
  }

  /**
   * Close the scanner webview.
   * @return {ScannerManager}
   */
  closeScanner() {
    // Remove the listeners to avoid further execution by other instances.
    event.removeListener(APP_EVENT_CLOSE_SCANNER, this.closeScanner);
    event.removeListener(APP_EVENT_SCANNER_DID_SCAN, this.scannerDidScanCallback);
    event.removeListener(APP_EVENT_SCANNER_DID_CAPTURE_IMAGE, this.scannerDidScanCallback);
    event.removeListener(APP_EVENT_SCANNER_ERROR_CLOSED, startScanner);
    // Close the scanner webview.
    closeScanner();
    return this;
  }
}

export default ScannerManager;
