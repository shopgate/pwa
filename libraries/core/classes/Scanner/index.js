import { logger } from '../../helpers';
import { isLibVersionAtLeast } from '../../helpers/version';
import ScannerEvent from '../ScannerEvent';
import ScannerEventHandler from '../ScannerEventHandler';
import appEvent from '../Event';
import registerEvents from '../../commands/registerEvents';

import {
  SCANNER_MODE_ON,
  SCANNER_TYPE_BARCODE,
  SCANNER_TYPE_IMAGE,
  SCANNER_ANIMATION_NONE,
} from '../../constants/Scanner';

import {
  openScanner as openAppScanner,
  startScanner as startAppScanner,
  closeScanner as closeAppScanner,
  setFlashlightMode as setAppScannerFlashlightMode,
} from '../../commands/scanner';

export const APP_EVENT_SCANNER_DID_SCAN = 'scannerDidScan';

export const SCANNER_MIN_APP_LIB_VERSION = '21.0';

/**
 * Represents the app scanner.
 */
export class Scanner {
  /**
   * Initializes the scanner
   */
  constructor() {
    this.supportedTypes = [SCANNER_TYPE_BARCODE, SCANNER_TYPE_IMAGE];

    this.scope = null;
    this.type = null;

    this.opened = false;
    this.running = false;

    this.closeHandler = null;

    this.flashlightEnabled = false;

    this.eventHandler = new ScannerEventHandler();

    // Register app scan event to listen for.
    registerEvents([APP_EVENT_SCANNER_DID_SCAN]);
  }

  /**
   * Adds an event listener to the scanner.
   * @param {ScannerEventListener} eventListener The eventListener to add.
   */
  addListener = (eventListener) => {
    this.eventHandler.attach(eventListener);
  }

  /**
   * @param {ScannerEventListener} eventListener The event listener to remove.
   * @returns {boolean} Returns false if the listener was not found by id. Returns true otherwise.
   */
  removeListener = eventListener => this.eventHandler.detach(eventListener);

  /**
   * Callback for the close handler for the scanner. The scanner stops scanning and notifies
   * the close handler when it's done. The close handler can either shut down the Scanner instance
   * by calling its close() method or restart it to continue scanning.
   *
   * @callback Scanner~CloseHandler
   * @param {Scanner} scannerInstance The instance of the scanner which requested closing.
   * @returns {undefined|null} The return value is ignored.
   */
  /**
   * Starts the app scanner. It will instantly start the scanning process for type
   * "barcodeRecognition". The image scanner requires user interaction to scan.
   * @param {string} scope The initially activated scanner scope.
   * @param {ScannerType|string} type The initially activated scanner type.
   * @param {CloseHandler|null} [closeHandler] This handler is called when the Scanner is closed.
   * @param {string|null} [source] Tells the app which overlay to use, null for "current".
   * @param {string|null} [animation] Tells the app what type of animation to apply when opening.
   */
  open = async (
    scope,
    type = SCANNER_TYPE_BARCODE,
    closeHandler = null,
    source = null,
    animation = null
  ) => {
    const errMsgPrefix = 'Failed to open scanner:';

    // A minimum app lib version is required, which is defined above.
    let libVersionResult;
    try {
      libVersionResult = await isLibVersionAtLeast(SCANNER_MIN_APP_LIB_VERSION);
    } catch (err) {
      logger.error(`${errMsgPrefix} Could not fetch app lib version. Instead received error:`, err);
      return;
    }
    if (!libVersionResult) {
      const err = new Error(`${errMsgPrefix} App lib version must be at least equal to or higher than ${SCANNER_MIN_APP_LIB_VERSION}.`);
      logger.error(err);
      return;
    }

    // Make sure the scope was properly set
    if (!scope || scope === '') {
      const err = new Error(`${errMsgPrefix} Scope can not be empty.`);
      logger.error(err);
      return;
    }

    if (!this.supportedTypes.includes(type)) {
      const err = new Error(`${errMsgPrefix} ${type} is a not supported scanner type.`);
      logger.error(err);
      return;
    }

    // Only one instance can be running at the same time.
    if (this.opened) {
      const err = new Error(`${errMsgPrefix} An instance with scope "${this.scope}" is already running.`);
      logger.error(err);
      return;
    }

    if (closeHandler !== null && typeof closeHandler !== 'function') {
      const err = new Error(`${errMsgPrefix} Close handler must be a function.`);
      logger.error(err);
      return;
    }

    // Add a listener to the scannerDidScan app event to process scanned data.
    appEvent.addCallback(APP_EVENT_SCANNER_DID_SCAN, this.handleScan);

    // Open the app scanner.
    openAppScanner({
      src: source || '',
      modes: {
        [type]: SCANNER_MODE_ON,
      },
      animation: animation || SCANNER_ANIMATION_NONE,
    });

    // Initialize internal states
    this.scope = scope;
    this.type = type;

    this.opened = true;

    // Image scanner does not automatically scan
    this.running = this.type !== SCANNER_TYPE_IMAGE;

    this.closeHandler = closeHandler || null;
  }

  /**
   * Starts the Scanner if it is opened and not already running.
   */
  start = () => {
    if (!this.opened) {
      logger.error(new Error("Can't start Scanner: Scanner is not opened."));
      return;
    }

    // Start only if not already running.
    if (!this.running) {
      this.running = true;
      startAppScanner();
    }
  }

  /**
   * Close the app scanner.
   */
  close = () => {
    if (!this.opened) {
      logger.warn("Can't close Scanner: Scanner is not opened.");
      return;
    }

    // Remove the listener to avoid further scan results.
    appEvent.removeCallback(APP_EVENT_SCANNER_DID_SCAN, this.handleScan);

    // Switch off flashlight to make sure it does not stay enabled.
    this.toggleFlashlight(false);

    closeAppScanner();

    // Cleanup internal states
    this.scope = null;
    this.type = null;

    this.opened = false;
    this.running = false;

    this.closeHandler = null;
  }

  /**
   * Switches between the flashlight being on or off. The return result might not always
   * be reliable when the app is brought into the background or if other apps interfere.
   * Can only be toggled when the scanner is opened.
   * @param {boolean|undefined} [enable] True/false to switch on/off or leave out for toggle.
   * @returns {boolean} Returns the new flashlight on/off state.
   */
  toggleFlashlight = (enable = undefined) => {
    if (!this.opened) {
      logger.error(new Error("Can't toggle the flashlight: Scanner not opened!"));
      return false;
    }

    if (enable !== undefined) {
      this.flashlightEnabled = !!enable;
    } else {
      this.flashlightEnabled = !this.flashlightEnabled;
    }

    setAppScannerFlashlightMode(this.flashlightEnabled);

    return this.flashlightEnabled;
  }

  /**
   * Because opening the scanner can fail silently, this is a way to check if it was
   * opened properly.
   * @returns {boolean}
   */
  isOpened = () => this.opened;

  /**
   * Some scanner types don't start and all of them stop running after a successful scan.
   * This method allows checking if a scan is currently in progress.
   * @returns {boolean}
   */
  isRunning = () => this.running;

  /**
   * Helps checking the current state of the flashlight. This might not be reliable as the
   * flashlight is turned off without notice, when the app is pushed into the background.
   * @returns {boolean}
   */
  isFlashlightEnabled = () => this.flashlightEnabled;

  /**
   * The internal handler for the "scannerDidScan" app event.
   * @private
   * @param {ScannerEventPayload} payload The payload of the scanner event for the scanned result.
   */
  handleScan = async (payload) => {
    this.running = false;

    try {
      // Ignore return values from handlers.
      await this.eventHandler.notifyAllListeners(new ScannerEvent(
        this.scope,
        this.type,
        payload
      ));

      // Notify the close handler that the Scanner is done doing his work.
      if (this.closeHandler) {
        this.closeHandler(this);
      }
    } catch (error) {
      // Force restart when a handler throws an error.
      this.start();
    }
  }
}

export default new Scanner();
