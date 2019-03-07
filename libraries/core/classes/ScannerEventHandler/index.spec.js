import ScannerEventHandler from './index';
import ScannerEventListener from '../ScannerEventListener';
import ScannerEvent from '../ScannerEvent';

// Prevent console output of the logger
jest.mock('../../helpers', () => ({
  logger: {
    debug: jest.fn(),
    dir: jest.fn(),
    dirxml: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    log: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('ScannerEventHandler', () => {
  const eventHandler = new ScannerEventHandler();
  beforeEach(() => {
    jest.clearAllMocks();
    eventHandler.eventListeners.clear();
  });

  describe('.constructor()', () => {
    it('should not have any listeners after initialization', () => {
      expect(eventHandler.eventListeners.size).toBe(0);
    });
  });

  describe('attach(eventListener)', () => {
    it('should attach the event listener', () => {
      const l = new ScannerEventListener();
      eventHandler.attach(l);

      expect(eventHandler.eventListeners.size).toBe(1);
      expect(eventHandler.eventListeners.has(l)).toBe(true);
    });

    it('should attach every event listener only once', () => {
      const l1 = new ScannerEventListener();
      const l2 = new ScannerEventListener();
      eventHandler.attach(l1);
      eventHandler.attach(l1);
      eventHandler.attach(l2);
      eventHandler.attach(l2);

      expect(eventHandler.eventListeners.size).toBe(2);
      expect(eventHandler.eventListeners.has(l1)).toBe(true);
      expect(eventHandler.eventListeners.has(l2)).toBe(true);
    });
  });

  describe('detach(eventListener)', () => {
    it('should detach the correct event listener', () => {
      const l1 = new ScannerEventListener();
      const l2 = new ScannerEventListener();
      const l3 = new ScannerEventListener();
      eventHandler.attach(l1);
      eventHandler.attach(l2);
      eventHandler.attach(l3);
      eventHandler.detach(l2);

      expect(eventHandler.eventListeners.size).toBe(2);
      expect(eventHandler.eventListeners.has(l1)).toBe(true);
      expect(eventHandler.eventListeners.has(l2)).toBe(false);
      expect(eventHandler.eventListeners.has(l3)).toBe(true);
    });

    it('should return true if a listener was detached', () => {
      const l = new ScannerEventListener();
      eventHandler.attach(l);
      expect(eventHandler.detach(l)).toBe(true);
    });

    it("should return false if a listener can't be found to detach", () => {
      const l = new ScannerEventListener();

      expect(eventHandler.detach(l)).toBe(false);
    });
  });

  describe('notifyAllListeners(event)', () => {
    const mockPayload = {
      format: 'format',
      code: 'code',
    };

    it('should notify all listeners', async () => {
      const customHandler = jest.fn();
      eventHandler.attach(new ScannerEventListener().setHandler(customHandler));
      eventHandler.attach(new ScannerEventListener().setHandler(customHandler));
      eventHandler.attach(new ScannerEventListener().setHandler(customHandler));

      await eventHandler.notifyAllListeners(new ScannerEvent('scope', 'type', mockPayload));
      expect(customHandler).toBeCalledTimes(3);
    });

    it('should notify interested listeners only', async () => {
      const customHandler = jest.fn();
      const scope1 = 'scope1';
      const scope2 = 'scope2';
      const type1 = 'type1';
      const type2 = 'type2';
      // Listeners to notify
      eventHandler.attach(new ScannerEventListener(null, null, null).setHandler(customHandler));
      eventHandler.attach(new ScannerEventListener(null, null, type1).setHandler(customHandler));
      eventHandler.attach(new ScannerEventListener(null, scope1, null).setHandler(customHandler));
      eventHandler.attach(new ScannerEventListener(null, scope1, type1).setHandler(customHandler));
      // Listeners to skip
      eventHandler.attach(new ScannerEventListener(null, null, type2).setHandler(customHandler));
      eventHandler.attach(new ScannerEventListener(null, scope1, type2).setHandler(customHandler));
      eventHandler.attach(new ScannerEventListener(null, scope2, null).setHandler(customHandler));
      eventHandler.attach(new ScannerEventListener(null, scope2, type1).setHandler(customHandler));
      eventHandler.attach(new ScannerEventListener(null, scope2, type2).setHandler(customHandler));

      await eventHandler.notifyAllListeners(new ScannerEvent(scope1, type1, mockPayload));
      expect(customHandler).toBeCalledTimes(4);
    });

    it('should throw the first error if one or more listeners failed', async () => {
      const error1 = new Error('Handle failed - ERROR 1!');
      const error2 = new Error('Handle failed - ERROR 2!');
      const failingHandler1 = jest.fn(async () => { throw error1; });
      const failingHandler2 = jest.fn(async () => { throw error2; });
      const succeedingHandler = jest.fn(async () => {});
      eventHandler.attach(new ScannerEventListener().setHandler(succeedingHandler));
      eventHandler.attach(new ScannerEventListener().setHandler(failingHandler2));
      eventHandler.attach(new ScannerEventListener().setHandler(failingHandler1));

      // Handler "failingHandler2" will fail first, because it is attached before "failingHandler1".
      await expect(eventHandler.notifyAllListeners(new ScannerEvent('scope', 'type', mockPayload)))
        .rejects.toThrow(error2);
    });

    it('should resolve with "undefined" if all listeners succeeded', async () => {
      const succeedingHandler = jest.fn(() => 'Some ignored return value');
      eventHandler.attach(new ScannerEventListener().setHandler(succeedingHandler));
      eventHandler.attach(new ScannerEventListener().setHandler(succeedingHandler));

      // Expect true (in an Array) for each listener
      expect(await eventHandler.notifyAllListeners(new ScannerEvent('scope', 'type', mockPayload)))
        .toBe(undefined);
    });
  });
});
