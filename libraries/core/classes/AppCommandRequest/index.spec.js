import AppCommandRequest from './index';
/* eslint-disable import/named */
import {
  triggerDispatchError,
  mockedSetCommandName,
  mockedSetCommandParams,
  mockedSetLibVersion,
  mockedDispatch,
} from '../AppCommand';
/* eslint-enable import/named */

jest.mock('../AppCommand');

let lastAddedEventCallback = null;
const mockedEventAddCallback = jest.fn();
const mockedEventRemoveCallback = jest.fn();
jest.mock('../Event', () => ({
  addCallback: (name, callback, ...args) => {
    mockedEventAddCallback(name, callback, ...args);
    lastAddedEventCallback = callback;
  },
  removeCallback: (...args) => {
    mockedEventRemoveCallback(...args);
  },
}));

const mockedRequestBufferAdd = jest.fn();
const mockedRequestBufferRemove = jest.fn();
jest.mock('../RequestBuffer', () => ({
  add: (...args) => {
    mockedRequestBufferAdd(...args);
  },
  remove: (...args) => {
    mockedRequestBufferRemove(...args);
  },
}));

const mockedLoggerError = jest.fn();
jest.mock('../../helpers', () => ({
  logger: {
    error: (...args) => {
      mockedLoggerError(...args);
    },
  },
  hasSGJavaScriptBridge: jest.fn().mockReturnValue(true),
}));

const mockedLogGroup = jest.fn();
// eslint-disable-next-line extra-rules/potential-point-free
jest.mock('../../helpers/logGroup', () => function logGroup(...args) {
  mockedLogGroup(...args);
});

const commandName = 'appCommand';
const eventName = 'appEvent';

describe('AppCommandRequest', () => {
  let instance;
  let cleanUpRequestSpy;
  let onDispatchSpy;
  let onResponseSpy;
  let getResponseLogPayloadSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    lastAddedEventCallback = null;
    instance = new AppCommandRequest(commandName, eventName);
    cleanUpRequestSpy = jest.spyOn(instance, 'cleanUpRequest');
    onDispatchSpy = jest.spyOn(instance, 'onDispatch');
    onResponseSpy = jest.spyOn(instance, 'onResponse');
    getResponseLogPayloadSpy = jest.spyOn(instance, 'getResponseLogPayload');
  });

  describe('.constructor()', () => {
    it('should apply parameters as expected', () => {
      expect(instance.commandName).toBe(commandName);
      expect(instance.eventName).toBe(eventName);
      expect(instance.commandParams).toBe(null);
      expect(instance.libVersion).toBe('25.0');
      expect(typeof instance.serial).toBe('string');
      expect(instance.serial.length).toBeGreaterThan(1);
      expect(typeof instance.callbackName).toBe('string');
      expect(instance.callbackName.length).toBeGreaterThan(1);
    });
  });

  describe('.setCommandParams()', () => {
    it('should set command params as expected', () => {
      const params = { permissionIds: [] };
      const result = instance.setCommandParams(params);
      expect(result).toEqual(instance);
      expect(result.commandParams).toEqual(params);
    });
  });

  describe('.setLibVersion()', () => {
    it('should set the lib version as expected', () => {
      const libVersion = '1337';
      const result = instance.setLibVersion(libVersion);
      expect(result).toEqual(instance);
      expect(result.libVersion).toEqual(libVersion);
    });
  });

  describe('.cleanUpRequest()', () => {
    it('should work like expected', () => {
      const callbackName = instance.getEventCallbackName();
      const callback = jest.fn();
      const { serial } = instance;

      const result = instance.cleanUpRequest(callback);
      expect(result).toEqual(instance);
      expect(mockedEventRemoveCallback).toHaveBeenCalledTimes(1);
      expect(mockedEventRemoveCallback).toHaveBeenCalledWith(callbackName, callback);
      expect(mockedRequestBufferRemove).toHaveBeenCalledTimes(1);
      expect(mockedRequestBufferRemove).toHaveBeenCalledWith(serial);
    });
  });

  describe('.onDispatch()', () => {
    const commandParams = { permissionIds: [] };
    const requestResponse = [{ some: 'data' }];

    // Promise callbacks.
    const resolveCallback = jest.fn();
    const rejectCallback = jest.fn();

    beforeEach(() => {
      // Overwrite the validate function to always return TRUE.
      instance.validateCommandParams = () => true;
      instance.setCommandParams(commandParams);
    });

    it('should resolve with response data when the instance is set up properly', async () => {
      const result = await instance.onDispatch(resolveCallback, rejectCallback);

      // Simulate callback invocation through the event listener.
      lastAddedEventCallback(instance.serial, requestResponse);

      // Checks for the promise resolve call.
      expect(resolveCallback).toHaveBeenCalledTimes(1);
      expect(resolveCallback).toHaveBeenCalledWith(requestResponse);
      expect(rejectCallback).toHaveBeenCalledTimes(0);
      expect(cleanUpRequestSpy).toHaveBeenCalledTimes(1);
      expect(cleanUpRequestSpy).toHaveBeenCalledWith(lastAddedEventCallback);

      // Checks for the onDispatch sequence.
      expect(result).toBeUndefined();
      expect(mockedRequestBufferAdd).toHaveBeenCalledTimes(1);
      expect(mockedRequestBufferAdd).toHaveBeenCalledWith(instance, instance.serial);
      expect(mockedEventAddCallback).toHaveBeenCalledTimes(1);
      // The callback (2nd parameter) is created within the method and access is not possible.
      expect(mockedEventAddCallback).toHaveBeenCalledWith(
        instance.getEventCallbackName(),
        expect.any(Function)
      );
      expect(mockedSetCommandName).toHaveBeenCalledTimes(1);
      expect(mockedSetCommandName).toHaveBeenCalledWith(commandName);
      expect(mockedSetLibVersion).toHaveBeenCalledTimes(1);
      expect(mockedSetLibVersion).toHaveBeenCalledWith(instance.libVersion);
      expect(mockedSetCommandParams).toHaveBeenCalledTimes(1);
      expect(mockedSetCommandParams).toHaveBeenCalledWith({
        serial: instance.serial,
        ...commandParams,
      });
      expect(mockedDispatch).toHaveBeenCalledTimes(1);
      expect(mockedLogGroup).toHaveBeenCalledTimes(2);

      expect(getResponseLogPayloadSpy).toHaveBeenCalledTimes(1);
      expect(getResponseLogPayloadSpy).toHaveBeenCalledWith(
        instance.serial,
        requestResponse
      );

      expect(onResponseSpy).toHaveBeenCalledTimes(1);
      expect(onResponseSpy).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
        instance.serial,
        requestResponse
      );
    });

    it('should reject when the command params are invalid', async () => {
      // Simulate invalid parameters.
      instance.validateCommandParams = () => false;
      const result = await instance.onDispatch(resolveCallback, rejectCallback);

      expect(result).toBeUndefined();
      expect(rejectCallback).toHaveBeenCalledTimes(1);
      expect(rejectCallback).toHaveBeenCalledWith(expect.any(Error));
      expect(resolveCallback).toHaveBeenCalledTimes(0);
      expect(mockedLoggerError).toHaveBeenCalledTimes(1);
      expect(mockedLoggerError).toHaveBeenCalledWith(expect.any(String), commandParams);
      expect(mockedLogGroup).toHaveBeenCalledTimes(0);
    });

    it('should reject when the command was not dispatched', async () => {
      // Resolve with error on command dispatch.
      triggerDispatchError();
      const result = await instance.onDispatch(resolveCallback, rejectCallback);
      expect(result).toBeUndefined();
      expect(rejectCallback).toHaveBeenCalledTimes(1);
      expect(rejectCallback).toHaveBeenCalledWith(expect.any(Error));
      expect(resolveCallback).toHaveBeenCalledTimes(0);
      expect(cleanUpRequestSpy).toHaveBeenCalledTimes(1);
      expect(cleanUpRequestSpy).toHaveBeenCalledWith(lastAddedEventCallback);
      expect(mockedLogGroup).toHaveBeenCalledTimes(0);
    });

    it('should be called and resolve during inherited .dispatch()', (done) => {
      instance.dispatch()
        .then((result) => {
          expect(result).toEqual(requestResponse);
          expect(onDispatchSpy).toHaveBeenCalledTimes(1);
          expect(onDispatchSpy).toHaveBeenCalledWith(expect.any(Function), expect.any(Function));
          expect(mockedLogGroup).toHaveBeenCalledTimes(2);
          done();
        });

      // Simulate callback invocation through the event listener.
      lastAddedEventCallback(instance.serial, requestResponse);
    });

    it('should be called and reject during inherited .dispatch()', (done) => {
      // Resolve with error on command dispatch.
      triggerDispatchError();
      instance.dispatch()
        .catch((e) => {
          expect(e).toBeInstanceOf(Error);
          expect(onDispatchSpy).toHaveBeenCalledTimes(1);
          expect(onDispatchSpy).toHaveBeenCalledWith(expect.any(Function), expect.any(Function));
          expect(cleanUpRequestSpy).toHaveBeenCalledTimes(1);
          expect(cleanUpRequestSpy).toHaveBeenCalledWith(lastAddedEventCallback);
          expect(mockedLogGroup).toHaveBeenCalledTimes(0);
          done();
        });
    });
  });

  describe('custom event payload handling', () => {
    it('should work as expected with custom handlers for event payload', (done) => {
      /* eslint-disable class-methods-use-this, require-jsdoc */
      class CustomRequest extends AppCommandRequest {
        getResponseLogPayload(number, string, serial) {
          return [number, string, serial];
        }

        onResponse(resolve, reject, number, string, serial) {
          resolve([number, string, serial]);
        }
      }
      /* eslint-enable class-methods-use-this, require-jsdoc */

      instance = new CustomRequest('CustomCommand', 'CustomEvent');
      instance.dispatch().then((response) => {
        expect(response).toEqual([1337, 'ACME', instance.serial]);
        expect(mockedLogGroup).toBeCalledWith(
          instance.getRequestLogTitle(),
          {},
          instance.logColor
        );
        expect(mockedLogGroup).toBeCalledWith(
          instance.getResponseLogTitle(),
          [1337, 'ACME', instance.serial],
          instance.logColor
        );
        done();
      });

      // Simulate app response event with uncommon payload order
      lastAddedEventCallback(1337, 'ACME', instance.serial);
    });

    it('should throw an error when custom response handler rejects', (done) => {
      /* eslint-disable class-methods-use-this, require-jsdoc */
      class CustomRequest extends AppCommandRequest {
        onResponse(resolve, reject) {
          reject(new Error('Fatal Error'));
        }
      }
      /* eslint-enable class-methods-use-this, require-jsdoc */

      instance = new CustomRequest('CustomCommand', 'CustomEvent');

      instance.dispatch().catch((e) => {
        expect(e).toEqual(new Error('Fatal Error'));
        done();
      });

      // Simulate app response event with uncommon payload order
      lastAddedEventCallback(instance.serial);
    });
  });
});
