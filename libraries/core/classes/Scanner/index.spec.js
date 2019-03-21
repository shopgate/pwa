import { logger } from '../../helpers';
import { Scanner } from './index';
import appEvent from '../Event';
import registerEvents from '../../commands/registerEvents';
import {
  openScanner,
  closeScanner,
  startScanner,
  setFlashlightMode,
  stopScanner,
} from '../../commands/scanner';
import {
  SCANNER_MODE_ON,
  SCANNER_TYPE_BARCODE,
  SCANNER_TYPE_IMAGE,
  SCANNER_ANIMATION_NONE,
} from '../../constants/Scanner';
import { APP_EVENT_SCANNER_DID_SCAN } from '../../constants/AppEvents';
import ScannerEventHandler from '../ScannerEventHandler';
import ScannerEventListener from '../ScannerEventListener';
import ScannerEvent from '../ScannerEvent';

jest.mock('../../helpers', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

let mockedIsLibVersionAtLeast;
jest.mock('../../helpers/version', () => ({
  isLibVersionAtLeast: (...args) => mockedIsLibVersionAtLeast(...args),
}));

jest.mock('../Event');
jest.mock('../../commands/registerEvents', () => jest.fn());
jest.mock('../../commands/scanner');

const mockedEventHandler = new ScannerEventHandler();
mockedEventHandler.attach = jest.fn();
mockedEventHandler.detach = jest.fn(() => true);

describe('Scanner', () => {
  let scannerInstance;
  const scope = 'scope';
  const type = SCANNER_TYPE_BARCODE;

  beforeEach(() => {
    jest.clearAllMocks();
    scannerInstance = new Scanner();
    mockedIsLibVersionAtLeast = jest.fn(() => true);
  });

  describe('constructor()', () => {
    it('should register the app scanners scan event correctly', () => {
      expect(registerEvents).toBeCalledTimes(1);
      expect(registerEvents).toBeCalledWith([APP_EVENT_SCANNER_DID_SCAN]);
    });

    it('should initialize the internal object state correctly', () => {
      expect(new Set(scannerInstance.supportedTypes))
        .toEqual(new Set([SCANNER_TYPE_BARCODE, SCANNER_TYPE_IMAGE]));
      expect(scannerInstance.scope).toBeNull();
      expect(scannerInstance.type).toBeNull();
      expect(scannerInstance.opened).toBeFalsy();
      expect(scannerInstance.running).toBeFalsy();
      expect(scannerInstance.closeHandler).toBeNull();
      expect(scannerInstance.flashlightEnabled).toBeFalsy();
      expect(scannerInstance.eventHandler instanceof ScannerEventHandler).toBeTruthy();
    });
  });

  describe('addListener()', () => {
    it('should attach the event listener to the event handler', () => {
      scannerInstance.eventHandler = mockedEventHandler;

      const l = new ScannerEventListener();
      scannerInstance.addListener(l);

      expect(mockedEventHandler.attach).toBeCalledTimes(1);
      expect(mockedEventHandler.attach).toBeCalledWith(l);
    });

    it('should not return any value', () => {
      expect(scannerInstance.addListener(new ScannerEventListener())).toBeUndefined();
    });
  });

  describe('removeListener()', () => {
    it('should detach the event listener from the event handler', () => {
      scannerInstance.eventHandler = mockedEventHandler;

      const l = new ScannerEventListener();
      scannerInstance.removeListener(l);

      expect(mockedEventHandler.detach).toBeCalledTimes(1);
      expect(mockedEventHandler.detach).toBeCalledWith(l);
    });

    it('should forward the return value from the event handler', () => {
      scannerInstance.eventHandler = mockedEventHandler;

      // The used event handler detach function is mocked to return true.
      expect(scannerInstance.removeListener(new ScannerEventListener())).toBeTruthy();
    });
  });

  describe('open()', () => {
    it('should not open and print an error if the app lib version is too low', async () => {
      const err = new Error('Failed to open scanner: App lib version must be at least equal to or higher than 21.0.');
      mockedIsLibVersionAtLeast = jest.fn(() => false);

      await expect(scannerInstance.open(scope)).resolves.toBeUndefined();
      expect(mockedIsLibVersionAtLeast).toBeCalledWith('21.0');
      expect(logger.error).toBeCalledTimes(1);
      expect(logger.error).toBeCalledWith(err);
      expect(scannerInstance.isOpened()).toBeFalsy();
    });

    it('should not open and print an error when the requested scope is empty', async () => {
      const err = new Error('Failed to open scanner: Scope can not be empty.');

      await expect(scannerInstance.open(null)).resolves.toBeUndefined();
      expect(logger.error).toBeCalledTimes(1);
      expect(logger.error).toBeCalledWith(err);
      expect(scannerInstance.isOpened()).toBeFalsy();
    });

    it('should print an error instead of opening when the requested scanner type is unsupported', async () => {
      const dummy = 'DUMMY_TYPE';
      const err = new Error(`Failed to open scanner: ${dummy} is a not supported scanner type.`);

      await expect(scannerInstance.open(scope, dummy)).resolves.toBeUndefined();
      expect(logger.error).toBeCalledTimes(1);
      expect(logger.error).toBeCalledWith(err);
      expect(scannerInstance.isOpened()).toBeFalsy();
    });

    it('should print an error and stay opened when already opened', async () => {
      const err = new Error(`Failed to open scanner: An instance with scope "${scope}" is already running.`);
      // Simulate opened state.
      scannerInstance.opened = true;
      scannerInstance.scope = scope;

      await expect(scannerInstance.open(scope)).resolves.toBeUndefined();
      expect(logger.error).toBeCalledTimes(1);
      expect(logger.error).toBeCalledWith(err);
      expect(scannerInstance.isOpened()).toBeTruthy();
    });

    it('should not open when an invalid close handler is set', async () => {
      const err = new Error('Failed to open scanner: Close handler must be a function.');

      // Pass an object instead of a callback to trigger the error
      await expect(scannerInstance.open(scope, type, {})).resolves.toBeUndefined();
      expect(logger.error).toBeCalledTimes(1);
      expect(logger.error).toBeCalledWith(err);
      expect(scannerInstance.isOpened()).toBeFalsy();
    });

    it('should register the app event callback', async () => {
      await scannerInstance.open(scope);

      expect(appEvent.addCallbackSpy).toBeCalledTimes(1);
      expect(appEvent.addCallbackSpy).toBeCalledWith(
        APP_EVENT_SCANNER_DID_SCAN,
        scannerInstance.handleScan
      );
    });

    it('should open the scanner', async () => {
      await scannerInstance.open(scope);

      expect(openScanner).toBeCalledTimes(1);
    });

    it('should provide correct parameters to the open scanner app command', async () => {
      await scannerInstance.open(scope);

      expect(openScanner).toBeCalledWith({
        src: '',
        modes: {
          [type]: SCANNER_MODE_ON,
        },
        animation: SCANNER_ANIMATION_NONE,
      });
    });

    it('should update the internal object state correctly', async () => {
      const closeHandler = jest.fn();
      await scannerInstance.open(scope, SCANNER_TYPE_BARCODE, closeHandler);

      expect(scannerInstance.scope).toStrictEqual(scope);
      expect(scannerInstance.type).toStrictEqual(SCANNER_TYPE_BARCODE);
      expect(scannerInstance.opened).toBeTruthy();
      expect(scannerInstance.running).toBeTruthy();
      expect(scannerInstance.closeHandler).toBe(closeHandler);

      // Recreate Scanner object to check a different set of open params.
      scannerInstance = new Scanner();
      await scannerInstance.open(scope, SCANNER_TYPE_IMAGE);

      expect(scannerInstance.type).toStrictEqual(SCANNER_TYPE_IMAGE);
      expect(scannerInstance.opened).toBeTruthy();
      expect(scannerInstance.running).toBeFalsy();
      expect(scannerInstance.closeHandler).toBe(null);
    });
  });

  describe('start()', () => {
    it('should print an error message if start is called without opening first', () => {
      scannerInstance.start();

      expect(logger.error).toBeCalledTimes(1);
      expect(startScanner).not.toBeCalled();
    });

    it('should not do anything if the Scanner is not opened', () => {
      scannerInstance.start();

      expect(startScanner).not.toBeCalled();
    });

    it('should not do anything when the Scanner is already running', async () => {
      await scannerInstance.open('scope');
      scannerInstance.start();

      expect(startScanner).not.toBeCalled();
    });

    it('should dispatch the startScanner command when the Scanner is not already running', async () => {
      await scannerInstance.open('scope');
      scannerInstance.running = false;
      scannerInstance.start();

      expect(startScanner).toBeCalled();
    });
  });

  describe('stop()', () => {
    it('should print an error message if start is called without opening first', () => {
      scannerInstance.stop();

      expect(logger.error).toBeCalledTimes(1);
      expect(stopScanner).not.toBeCalled();
    });

    it('should not do anything if the Scanner is not opened', () => {
      scannerInstance.stop();

      expect(stopScanner).not.toBeCalled();
    });

    it('should not do anything when the Scanner is not running', () => {
      scannerInstance.stop();

      expect(stopScanner).not.toBeCalled();
    });

    it('should dispatch the stopScanner command when the Scanner is running', async () => {
      await scannerInstance.open('scope');
      scannerInstance.stop();

      expect(stopScanner).toBeCalled();
    });
  });

  describe('close()', () => {
    beforeEach(async () => {
      await scannerInstance.open(scope);
    });

    it('should print a warning if close is called without opening first', () => {
      // Closing twice should trigger this warning.
      scannerInstance.close();
      scannerInstance.close();

      expect(logger.warn).toBeCalledTimes(1);
    });

    it('should unregister the handleScan callback', () => {
      scannerInstance.close();

      expect(appEvent.removeCallbackSpy).toBeCalledTimes(1);
      expect(appEvent.removeCallbackSpy).toBeCalledWith(
        APP_EVENT_SCANNER_DID_SCAN,
        scannerInstance.handleScan
      );
    });

    it('should force switch off the flashlight', () => {
      scannerInstance.toggleFlashlight(true);
      expect(scannerInstance.flashlightEnabled).toBeTruthy();

      scannerInstance.close();

      expect(scannerInstance.flashlightEnabled).toBeFalsy();
    });

    it('should close the app scanner', () => {
      scannerInstance.close();

      expect(closeScanner).toBeCalled();
    });

    it('should reset the internal object state correctly', () => {
      expect(scannerInstance.scope).not.toBeNull();

      scannerInstance.close();

      expect(scannerInstance.scope).toBeNull();
      expect(scannerInstance.type).toBeNull();
      expect(scannerInstance.opened).toBeFalsy();
      expect(scannerInstance.running).toBeFalsy();
      expect(scannerInstance.closeHandler).toBeNull();
      expect(scannerInstance.flashlightEnabled).toBeFalsy();
    });
  });

  describe('toggleFlashlight()', () => {
    beforeEach(async () => {
      await scannerInstance.open(scope);
    });

    it('should allow setting the flashlight mode directly', () => {
      // Start with "off" state.
      expect(scannerInstance.flashlightEnabled).toBeFalsy();

      // Make sure setting it to "off" again does not toggle.
      scannerInstance.toggleFlashlight(false);
      expect(scannerInstance.flashlightEnabled).toBeFalsy();

      // Now make sure switching "on" works.
      scannerInstance.toggleFlashlight(true);
      expect(scannerInstance.flashlightEnabled).toBeTruthy();

      // Now make sure switching "on"  again does not toggle.
      scannerInstance.toggleFlashlight(true);
      expect(scannerInstance.flashlightEnabled).toBeTruthy();

      // Check if switching "off" works as well, when it was enabled.
      scannerInstance.toggleFlashlight(false);
      expect(scannerInstance.flashlightEnabled).toBeFalsy();
    });

    it('should allow to toggle between on and off modes', () => {
      // Start with "off" state.
      expect(scannerInstance.flashlightEnabled).toBeFalsy();

      // Test if simple "toggle" enables it now
      scannerInstance.toggleFlashlight();
      expect(scannerInstance.flashlightEnabled).toBeTruthy();

      // Test if a second "toggle" disables it afterwards
      scannerInstance.toggleFlashlight();
      expect(scannerInstance.flashlightEnabled).toBeFalsy();
    });

    it('should call the app command even if the internal state did not change', () => {
      // Start at "off".
      expect(scannerInstance.flashlightEnabled).toBeFalsy();

      // Call the app command no matter what state it is (to allow resolving state inconsistencies)
      scannerInstance.toggleFlashlight(false);
      expect(setFlashlightMode).toBeCalledTimes(1);
      scannerInstance.toggleFlashlight(true);
      expect(setFlashlightMode).toBeCalledTimes(2);
      scannerInstance.toggleFlashlight(true);
      expect(setFlashlightMode).toBeCalledTimes(3);
      scannerInstance.toggleFlashlight(false);
      expect(setFlashlightMode).toBeCalledTimes(4);
      scannerInstance.toggleFlashlight(false);
      expect(setFlashlightMode).toBeCalledTimes(5);
      scannerInstance.toggleFlashlight();
      expect(setFlashlightMode).toBeCalledTimes(6);
      scannerInstance.toggleFlashlight();
      expect(setFlashlightMode).toBeCalledTimes(7);
      scannerInstance.toggleFlashlight();
      expect(setFlashlightMode).toBeCalledTimes(8);
    });

    it('should call the app command correctly', () => {
      // Start with "off" state.
      expect(scannerInstance.flashlightEnabled).toBeFalsy();

      // Toggle "on".
      scannerInstance.toggleFlashlight();
      expect(setFlashlightMode).toBeCalledWith(true);

      // Toggle "off".
      scannerInstance.toggleFlashlight();
      expect(setFlashlightMode).toBeCalledWith(false);

      // Switch "off".
      scannerInstance.toggleFlashlight(false);
      expect(setFlashlightMode).toBeCalledWith(false);

      // Switch "on".
      scannerInstance.toggleFlashlight(true);
      expect(setFlashlightMode).toBeCalledWith(true);
    });
  });

  describe('handleScan()', () => {
    const payload = {
      format: 'format',
      code: 'code',
    };
    const closeHandlerMock = jest.fn();

    beforeEach(async () => {
      await scannerInstance.open(scope, type, closeHandlerMock);
    });

    it('should forward a ScannerEvent to the event handler', async () => {
      let result = null;
      const mockedNotifyAllListeners = jest.fn((e) => { result = e; });
      scannerInstance.eventHandler.notifyAllListeners = mockedNotifyAllListeners;
      await scannerInstance.handleScan(payload);

      expect(mockedNotifyAllListeners).toBeCalledTimes(1);
      expect(result instanceof ScannerEvent).toBeTruthy();
      expect(result.payload).toBe(payload);
    });

    it('should notify the close handler if the Scanner is done scanning', async () => {
      await scannerInstance.handleScan(payload);

      expect(closeHandlerMock).toBeCalledTimes(1);
      expect(closeHandlerMock).toBeCalledWith(scannerInstance);
    });

    it('should restart if any of the listeners throws an error', async () => {
      scannerInstance.start = jest.fn();
      scannerInstance.addListener(new ScannerEventListener().setHandler(async () => {
        throw new Error('Dummy error to enforce Scanner restart!');
      }));
      await scannerInstance.handleScan(payload);

      expect(scannerInstance.opened).toBeTruthy();
      expect(scannerInstance.start).toBeCalledTimes(1);
    });

    it('should not be running after a successful scan if not restarted', async () => {
      const stopSpy = jest.spyOn(scannerInstance, 'stop');
      await scannerInstance.handleScan(payload);

      expect(scannerInstance.running).toBeFalsy();
      expect(stopSpy).toBeCalled();
    });

    it("should not close the Scanner on it's own", async () => {
      await scannerInstance.handleScan(payload);

      expect(scannerInstance.opened).toBeTruthy();
    });

    it('should return a promise', async () => {
      expect(scannerInstance.handleScan(payload) instanceof Promise).toBeTruthy();
    });

    it('should catch all errors, from the listeners', async () => {
      scannerInstance.addListener(new ScannerEventListener().setHandler(async () => {
        throw new Error('First error to catch!');
      }));
      scannerInstance.addListener(new ScannerEventListener().setHandler(async () => {
        throw new Error('Second error to catch!');
      }));

      // The Promise should resolve to "undefined" rather than throw an error (mute errors).
      await expect(scannerInstance.handleScan(payload)).resolves.toBeUndefined();
    });
  });
});
