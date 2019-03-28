import { logger } from '../../helpers';
import event from '../Event';

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

export const APP_EVENT_CLOSE_SCANNER = 'closeScanner';
export const APP_EVENT_SCANNER_DID_SCAN = 'scannerDidScan';
export const APP_EVENT_SCANNER_ERROR_CONFIRMED = 'scannerErrorConfirmed';
export const APP_EVENT_SCANNER_RESULT_PROCESSED = 'scannerResultProcessed';

let eventsRegistered = false;

/**
 * A callback that is invoked whenever the scanner recognized supported content.
 * @callback scanHandler
 * @param {Object} payload The event payload for a successful content scan.
 */

/**
 * The ScannerManager class. It's intendend to simplify the processes that are necessary to
 * programmatically interact with the scanner feature of the app. It provides the possibility to
 * register a handler callback to process the scanned content.
 * @deprecated This is a legacy implementation. Use Scanner instead.
 */
class ScannerManager {
  /**
   * The ScannerManager constructor.
   * @param {Object} options Options for the ScannerManager.
   * @param {boolean} [options.autoClose=true] If set to TRUE, the app scanner will close
   *  automatically after a successful scan.
   */
  constructor(options = {}) {
    this.autoClose = true;

    if (typeof options.autoClose === 'boolean') {
      this.autoClose = options.autoClose;
    }

    this.scanHandler = () => {};

    this.supportedTypes = [SCANNER_TYPE_BARCODE, SCANNER_TYPE_IMAGE];

    /**
     * Create references to the app event handler fuctions. They preserve the "this" context of
     * a ScannerManager instance and can be used to register and unregister event listeners.
     */
    this.scannerDidScanListener = this.scannerDidScanListener.bind(this);
    this.closeScanner = this.closeScanner.bind(this);

    if (!eventsRegistered) {
      // Register the necessary events if it not already happened.
      registerEvents([
        APP_EVENT_CLOSE_SCANNER,
        APP_EVENT_SCANNER_DID_SCAN,
        APP_EVENT_SCANNER_ERROR_CONFIRMED,
      ]);

      eventsRegistered = true;
    }
  }

  /**
   * The internal handler for the "scannerDidScan" app event.
   * @private
   * @param {Object} payload The event payload.
   */
  scannerDidScanListener(payload) {
    /**
     * Trigger a scannerResultProcessed event to inform the scanner view
     * about the outcome of the scan payload processing.
     * @param {string} requestId The id of the scanner request.
     * @param {boolean} [success=true] Whether the processing was successful or not.
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
      const { requestId, scannerType, ...data } = payload;

      try {
        // Invoke the scan handler. Split the actual scan payload from the meta data.
        await this.scanHandler({
          scannerType,
          requestId,
          data,
        });
        // Inform the scanner view about the outcome.
        scannerResultProcessedEvent(requestId);
        if (this.autoClose) {
          // Close the scanner after a successful scan.
          this.closeScanner();
        }
      } catch (error) {
        const { message, title = null } = error;
        // Trigger an error message within the scanner webview when content processing failed.
        scannerResultProcessedEvent(requestId, false, {
          message,
          title,
        });
      }
    };

    execScanCallback();
  }

  /**
   * Register a handler to process scanned content. Errors that are thrown inside will be displayed
   * to the user as a notification, so that the webview can stay open for further scan attempts.
   * It's recommended to use the ScanProcessingError for that purpose,
   * since it provides the possiblity to set a message and a title for the notification.
   * @param {scanHandler} handler The callback - async functions are supported.
   * @return {ScannerManager}
   */
  registerScanHandler(handler) {
    if (typeof handler === 'function') {
      this.scanHandler = handler;
    }

    return this;
  }

  /**
   * Open the scanner webview. It will instantly start the scanning process when the barcode scanner
   * is active. For the image scanner user interaction is necessary.
   * @param {string} type The initially activated scanner type.
   * @return {ScannerManager}
   */
  openScanner(type = SCANNER_TYPE_BARCODE) {
    if (!this.supportedTypes.includes(type)) {
      logger.error(`Scanner opening failed. ${type} is a not supported scanner type.`);
      return this;
    }

    // Add a listener to the closeScanner event to react on a close button press in the scanner.
    event.addCallback(APP_EVENT_CLOSE_SCANNER, this.closeScanner);
    // Add a listener to the scannerDidScan event to process scanner data.
    event.addCallback(APP_EVENT_SCANNER_DID_SCAN, this.scannerDidScanListener);
    // Add a listener to restart the scanner recognition after the user accepted the notification.
    event.addCallback(APP_EVENT_SCANNER_ERROR_CONFIRMED, startScanner);
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
    event.removeCallback(APP_EVENT_CLOSE_SCANNER, this.closeScanner);
    event.removeCallback(APP_EVENT_SCANNER_DID_SCAN, this.scannerDidScanListener);
    event.removeCallback(APP_EVENT_SCANNER_ERROR_CONFIRMED, startScanner);

    // Close the scanner webview.
    closeScanner();
    return this;
  }
}

export default ScannerManager;
