import ScannerEventListener from './index';
import ScannerEvent from '../ScannerEvent';
import AppScanner from '../Scanner';
import { logger } from '../../helpers';

jest.mock('@shopgate/pwa-core/classes/AppCommand');
jest.mock('../../helpers', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('ScannerEventListener', () => {
  const name = 'Mocked Event Listener';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor()', () => {
    it('should initialize the name correctly if none was set', () => {
      const l = new ScannerEventListener();

      expect(l.name).toBe('unnamed');
    });

    it('should initialize the type and scope correctly if none were set', () => {
      const l = new ScannerEventListener();

      expect(l.scope).toBe(null);
      expect(l.type).toBe(null);
    });

    it('should store the name, scope and type correctly if they were set', () => {
      const scope = 'testScope';
      const type = 'testType';
      const l = new ScannerEventListener(name, scope, type);

      expect(l.name).toBe(name);
      expect(l.scope).toBe(scope);
      expect(l.type).toBe(type);
    });

    it('should not have a default handler after new instance creation', () => {
      const l = new ScannerEventListener();

      expect(l.handler).toBe(null);
    });
  });

  describe('setHandler(handler)', () => {
    it('should output an error if the given handler is not a function', () => {
      // Just pass a string instead of a real handler
      const invalidHandler = 'invalid handler';
      const invalidHandlerErrorMessage = 'The ScannerEventListener handler must be a function!';
      new ScannerEventListener().setHandler(invalidHandler);

      expect(logger.error).toBeCalledTimes(1);
      expect(logger.error).toBeCalledWith(new Error(invalidHandlerErrorMessage));
    });

    it('should not output an "invalid handler" error for a valid handler', () => {
      new ScannerEventListener().setHandler(jest.fn());

      expect(logger.error).not.toBeCalled();
    });

    it('should return the current listener instance after setting the handler', () => {
      const l = new ScannerEventListener();

      expect(l.setHandler(jest.fn())).toBe(l);
    });

    it('should set the handler correctly', () => {
      const customHandler = jest.fn();
      const l = new ScannerEventListener().setHandler(customHandler);

      expect(l.handler).toBe(customHandler);
    });
  });

  describe('attach()', () => {
    // Make sure to restore scanner object functionality after each test
    const { addListener } = AppScanner;
    afterEach(() => {
      AppScanner.addListener = addListener;
    });

    it('should attach the new listener to the global Scanner object', () => {
      AppScanner.addListener = jest.fn();
      const l = new ScannerEventListener();
      l.attach();

      expect(AppScanner.addListener).toBeCalledTimes(1);
      expect(AppScanner.addListener).toBeCalledWith(l);
    });
  });

  describe('canHandleEvent(event)', () => {
    const mockPayload = {
      format: 'format',
      code: 'code',
    };

    it('should return false and print a warning if no handlers are attached', () => {
      const l = new ScannerEventListener();
      const result = l.canHandleEvent(null);
      expect(result).toBe(false);
      expect(logger.warn).toBeCalledTimes(1);
    });

    it('should return true on every event for "global" listeners', () => {
      const listenScope = null;
      const listenType = null;
      const differentScope = 'different-scope';
      const differentType = 'different-type';
      const l = new ScannerEventListener(name, listenScope, listenType).setHandler(() => {});
      const result = l.canHandleEvent(new ScannerEvent(differentScope, differentType, mockPayload));

      expect(result).toBe(true);
    });

    it('should return the correct values for specific event scopes only', () => {
      const listenScope = 'interesting-scope';
      const differentScope = 'different-scope';
      const anyType = 'any-type';
      const l = new ScannerEventListener(name, listenScope).setHandler(() => {});
      const result = [
        l.canHandleEvent(new ScannerEvent(listenScope, anyType, mockPayload)),
        l.canHandleEvent(new ScannerEvent(differentScope, anyType, mockPayload)),
      ];

      expect(result).toEqual([true, false]);
    });

    it('should return the correct values for specific event types only', () => {
      const listenType = 'interesting-type';
      const differentType = 'different-type';
      const anyScope = 'any-scope';
      const l = new ScannerEventListener(name, null, listenType).setHandler(() => {});
      const result = [
        l.canHandleEvent(new ScannerEvent(anyScope, listenType, mockPayload)),
        l.canHandleEvent(new ScannerEvent(anyScope, differentType, mockPayload)),
      ];

      expect(result).toEqual([true, false]);
    });

    it('should return the correct values for specific event scope/type combinations only', () => {
      const listenScope = 'interesting-scope';
      const listenType = 'interesting-type';
      const differentScope = 'different-scope';
      const differentType = 'different-type';
      const l = new ScannerEventListener(name, listenScope, listenType).setHandler(() => {});
      const result = [
        l.canHandleEvent(new ScannerEvent(listenScope, listenType, mockPayload)),
        l.canHandleEvent(new ScannerEvent(listenScope, differentType, mockPayload)),
        l.canHandleEvent(new ScannerEvent(differentScope, listenType, mockPayload)),
        l.canHandleEvent(new ScannerEvent(differentScope, differentType, mockPayload)),
      ];

      expect(result).toEqual([true, false, false, false]);
    });

    it('should return the correct values for specific payload format combinations only ', () => {
      const listenScope = 'interesting-scope';
      const listenType = 'interesting-type';
      const listenFormats = ['format'];
      const l = new ScannerEventListener(name, listenScope, listenType, listenFormats)
        .setHandler(() => { });

      const result = [
        l.canHandleEvent(new ScannerEvent(listenScope, listenType, mockPayload)),
        l.canHandleEvent(new ScannerEvent(listenScope, listenType, {
          ...mockPayload,
          format: 'otherFormat',
        })),
      ];

      expect(result).toEqual([true, false]);
    });
  });

  describe('notify(event)', () => {
    const mockPayload = {
      format: 'format',
      code: 'code',
    };

    it('should print a warning if the custom handler returns a value', async () => {
      const customHandler = jest.fn(() => 'Some return-value');
      const l = new ScannerEventListener(name).setHandler(customHandler);
      await l.notify(new ScannerEvent('scope', 'type', mockPayload));

      expect(logger.warn).toBeCalledTimes(1);
    });

    it('should call the handler for specific event scope/type combinations only', async () => {
      const customHandler = jest.fn();
      const listenScope = 'interesting-scope';
      const listenType = 'interesting-type';
      const differentScope = 'different-scope';
      const differentType = 'different-type';
      const l = new ScannerEventListener(name, listenScope, listenType).setHandler(customHandler);
      await l.notify(new ScannerEvent(listenScope, listenType, mockPayload));
      await l.notify(new ScannerEvent(listenScope, differentType, mockPayload));
      await l.notify(new ScannerEvent(differentScope, listenType, mockPayload));
      await l.notify(new ScannerEvent(differentScope, differentType, mockPayload));

      expect(customHandler).toBeCalledTimes(1);
      const [[event]] = customHandler.mock.calls;
      expect(event).toBeInstanceOf(ScannerEvent);
      expect(event.getScope()).toBe(listenScope);
      expect(event.getType()).toBe(listenType);
      expect(event.getPayload()).toEqual(mockPayload);
    });

    it('should forward the handler error to the caller', async () => {
      const customHandlerError = new Error('Custom handler failed!');
      const customHandler = jest.fn(async () => { throw customHandlerError; });
      const l = new ScannerEventListener(name).setHandler(customHandler);

      await expect(l.notify(new ScannerEvent('scope', 'type', mockPayload)))
        .rejects.toThrow(customHandlerError);
    });
  });
});
