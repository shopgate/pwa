import { hasSGJavaScriptBridge } from '../../helpers';
import {
  PERMISSION_ID_CAMERA,
  PERMISSION_ID_LOCATION,
  STATUS_GRANTED,
} from '../../constants/AppPermissions';
import Request from '../Request';
import AppPermissionsRequest from './AppPermissionsRequest';
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

const parentDispatchSpy = jest.spyOn(Request.prototype, 'dispatch');

const commandName = 'appCommand';
const eventName = 'appEvent';

describe('AppPermissionsRequest', () => {
  let instance;
  let cleanUpRequestSpy;
  let onDispatchSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    lastAddedEventCallback = null;
    instance = new AppPermissionsRequest(commandName, eventName);
    cleanUpRequestSpy = jest.spyOn(instance, 'cleanUpRequest');
    onDispatchSpy = jest.spyOn(instance, 'onDispatch');
  });

  describe('.constructor()', () => {
    it('should apply parameters as expected', () => {
      expect(instance.commandName).toBe(commandName);
      expect(instance.eventName).toBe(eventName);
      expect(instance.commandParams).toBe(null);
      expect(instance.libVersion).toBe('18.0');
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

  describe('.validateCommandParams()', () => {
    it('should throw an error when not overwritten', () => {
      expect(instance.validateCommandParams).toThrowError(Error);
    });
  });

  describe('.onDispatch()', () => {
    const commandParams = { permissionIds: [] };
    const permissionsResponse = [{}];

    // Promise callbacks.
    const resolveCallback = jest.fn();
    const rejectCallback = jest.fn();

    beforeEach(() => {
      // Overwrite the validate function to always return TRUE.
      instance.validateCommandParams = () => true;
      instance.setCommandParams(commandParams);
    });

    it('should resolve with permissions when the instance is set up properly', async () => {
      const result = await instance.onDispatch(resolveCallback, rejectCallback);

      // Simulate callback invocation through the event listener.
      lastAddedEventCallback(instance.serial, permissionsResponse);

      // Checks for the promise resolve call.
      expect(resolveCallback).toHaveBeenCalledTimes(1);
      expect(resolveCallback).toHaveBeenCalledWith(permissionsResponse);
      expect(rejectCallback).toHaveBeenCalledTimes(0);
      expect(cleanUpRequestSpy).toHaveBeenCalledTimes(1);
      expect(cleanUpRequestSpy).toHaveBeenCalledWith(lastAddedEventCallback);

      // Checks for the onDispatch sequence.
      expect(result).toBeUndefined();
      expect(mockedRequestBufferAdd).toHaveBeenCalledTimes(1);
      expect(mockedRequestBufferAdd).toHaveBeenCalledWith(instance, instance.serial);
      expect(mockedEventAddCallback).toHaveBeenCalledTimes(1);
      // The callback (2nd paramter) is created within the method and access is not possible.
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
          expect(result).toEqual(permissionsResponse);
          expect(onDispatchSpy).toHaveBeenCalledTimes(1);
          expect(onDispatchSpy).toHaveBeenCalledWith(expect.any(Function), expect.any(Function));
          expect(mockedLogGroup).toHaveBeenCalledTimes(2);
          done();
        });

      // Simulate callback invocation through the event listener.
      lastAddedEventCallback(instance.serial, permissionsResponse);
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

  describe('.dispatch()', () => {
    /* eslint-disable extra-rules/no-single-line-objects */
    const expected = [
      { permissionId: PERMISSION_ID_CAMERA, status: STATUS_GRANTED },
      { permissionId: PERMISSION_ID_LOCATION, status: STATUS_GRANTED },
    ];
    /* eslint-enable extra-rules/no-single-line-objects */

    it('should call the parent dispatch when a SGJavaScriptBridge is present', () => {
      instance.validateCommandParams = () => true;

      instance.dispatch();
      expect(parentDispatchSpy).toHaveBeenCalledTimes(1);
    });

    it('should mock the response for a getAppPermissions request when no SGJavaScriptBridge is present', async () => {
      hasSGJavaScriptBridge.mockReturnValueOnce(false);
      const params = { permissionIds: [PERMISSION_ID_CAMERA, PERMISSION_ID_LOCATION] };
      instance.setCommandParams(params);

      const response = await instance.dispatch();
      expect(response).toEqual(expected);
      expect(parentDispatchSpy).not.toHaveBeenCalled();
    });

    it('should mock the response for a requestAppPermissions request when no SGJavaScriptBridge is present', async () => {
      hasSGJavaScriptBridge.mockReturnValueOnce(false);
      const params = {
        permissions: [{
          permissionId: PERMISSION_ID_CAMERA,
        }, {
          permissionId: PERMISSION_ID_LOCATION,
        }],
      };
      instance.setCommandParams(params);

      const response = await instance.dispatch();
      expect(response).toEqual(expected);
      expect(parentDispatchSpy).not.toHaveBeenCalled();
    });
  });
});
