import DevServerBridge from './index';

// A libVersion for the bridge method calls
const libVersion = '16.1';
const devServerIp = '192.168.0.1';
const devServerPort = '1337';

// Mocks of the env variables.
global.process.env = {
  IP: devServerIp,
  PORT: devServerPort,
};

// Mocks of the global Headers class.
global.Headers = () => {};

// Create a mock for the fetch method.
const mockedFetchResponse = {};
let mockedFetch;
jest.mock('isomorphic-fetch', () => (...args) => mockedFetch(...args));

// Create a mock for the Event class.
const mockedEventCall = jest.fn();
jest.mock('../Event', () => ({ call: (...args) => mockedEventCall(...args) }));

// Create a mock for the error logger.
const mockedLoggerError = jest.fn();
jest.mock('../../helpers', () => ({
  logger: {
    error: (...args) => {
      mockedLoggerError(...args);
    },
  },
}));

let dispatchCommandSpy;
let processResponseSpy;

/**
 * Updates the mock for the fetch module.
 * @param {boolean} throwError Wheater the mocked fetch shall throw an error.
 */
const updateMockedFetch = (throwError = false) => {
  if (!throwError) {
    mockedFetch = jest.fn().mockResolvedValue({ json: () => mockedFetchResponse });
  } else {
    mockedFetch = jest.fn().mockRejectedValue(new Error());
  }
};

describe('DevServerBridge', () => {
  let instance;

  beforeEach(() => {
    mockedEventCall.mockClear();
    updateMockedFetch();
    instance = new DevServerBridge();
    dispatchCommandSpy = jest.spyOn(instance, 'dispatchCommandForVersion');
    processResponseSpy = jest.spyOn(instance, 'processDevServerResponse');
  });

  describe('.constructor()', () => {
    it('should work as expected without parameters', () => {
      expect(instance.ip).toBe(devServerIp);
      expect(instance.port).toBe(devServerPort);
    });

    it('should apply custom parameters', () => {
      const customIp = '127.0.0.1';
      const customPort = '4711';

      instance = new DevServerBridge(customIp, customPort);
      expect(instance.ip).toBe(customIp);
      expect(instance.port).toBe(customPort);
    });
  });

  describe('.dispatchCommandsForVersion()', () => {
    it('should call dispatchCommand for every single command', () => {
      const commands = [{
        c: 'sendPipelineRequest',
      }, {
        c: 'openPage',
      }];

      const result = instance.dispatchCommandsForVersion(commands, libVersion);
      expect(result).toEqual(instance);
      expect(dispatchCommandSpy).toHaveBeenCalledTimes(2);
      expect(dispatchCommandSpy.mock.calls[0][0].c).toBe('sendPipelineRequest');
      expect(dispatchCommandSpy.mock.calls[0][1]).toBe(libVersion);
      expect(dispatchCommandSpy.mock.calls[1][0].c).toBe('openPage');
      expect(dispatchCommandSpy.mock.calls[1][1]).toBe(libVersion);
    });

    it('should call dispatchCommand when no commands where passed', () => {
      const result = instance.dispatchCommandsForVersion(null, libVersion);
      expect(result).toEqual(instance);
      expect(dispatchCommandSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('.dispatchCommandForVersion()', () => {
    it('should dispatch a webStorage entry command', (done) => {
      const name = 'getWebStorageEntry';
      const command = {
        c: name,
      };

      const result = instance.dispatchCommandForVersion(command, libVersion);
      expect(result).toEqual(instance);
      // The dispatch method has async behavior. So we wait for the next tick before we check.
      setTimeout(() => {
        expect(mockedFetch).toHaveBeenCalledTimes(1);
        expect(mockedFetch.mock.calls[0][0].endsWith('web_storage')).toBe(true);
        expect(mockedFetch.mock.calls[0][1].body.includes(name)).toBe(true);
        expect(processResponseSpy).toHaveBeenCalledTimes(1);
        done();
      }, 0);
    });

    it('should dispatch a httpRequest command', (done) => {
      const name = 'sendHttpRequest';
      const command = {
        c: name,
      };

      const result = instance.dispatchCommandForVersion(command, libVersion);
      expect(result).toEqual(instance);
      // The dispatch method has async behavior. So we wait for the next tick before we check.
      setTimeout(() => {
        expect(mockedFetch).toHaveBeenCalledTimes(1);
        expect(mockedFetch.mock.calls[0][0].endsWith('http_request')).toBe(true);
        expect(mockedFetch.mock.calls[0][1].body.includes(name)).toBe(true);
        expect(processResponseSpy).toHaveBeenCalledTimes(1);
        done();
      }, 0);
    });

    it('should not do anything if the command is not whitelisted', (done) => {
      const command = {
        c: 'openPage',
      };

      const result = instance.dispatchCommandForVersion(command, libVersion);
      expect(result).toEqual(instance);
      // The dispatch method has async behavior. So we wait for the next tick before we check.
      setTimeout(() => {
        expect(mockedFetch).toHaveBeenCalledTimes(0);
        expect(processResponseSpy).toHaveBeenCalledTimes(0);
        done();
      }, 0);
    });

    it('should not do anything if the command is empty', (done) => {
      const result = instance.dispatchCommandForVersion(null, libVersion);
      expect(result).toEqual(instance);
      // The dispatch method has async behavior. So we wait for the next tick before we check.
      setTimeout(() => {
        expect(mockedFetch).toHaveBeenCalledTimes(0);
        expect(processResponseSpy).toHaveBeenCalledTimes(0);
        done();
      }, 0);
    });

    it('should handle fetch errors', (done) => {
      updateMockedFetch(true);
      const command = {
        c: 'sendPipelineRequest',
      };

      const result = instance.dispatchCommandForVersion(command, libVersion);
      expect(result).toEqual(instance);
      // The dispatch method has async behavior. So we wait for the next tick before we check.
      setTimeout(() => {
        expect(mockedFetch).toHaveBeenCalledTimes(1);
        expect(processResponseSpy).toHaveBeenCalledTimes(0);
        expect(mockedLoggerError).toHaveBeenCalledTimes(1);
        expect(mockedLoggerError.mock.calls[0][0]).toBeInstanceOf(Error);
        done();
      }, 0);
    });
  });

  describe('.processDevServerResponse()', () => {
    it('should handle a response commands as expected', () => {
      const serial = 'abc123';
      const commands = [{
        c: 'pipelineResponse',
        p: {
          serial,
          error: null,
          output: {},
        },
      }, {
        c: 'httpResponse',
        p: {
          serial,
          error: null,
          response: {},
        },
      }, {
        c: 'dataResponse',
        p: {
          serial,
          status: 200,
          body: '',
          bodyContentType: '',
        },
      }, {
        c: 'webStorageResponse',
        p: {
          serial,
          age: 40,
          value: {},
        },
      }, {
        c: 'unknownResponse',
        p: {},
      }];

      const result = instance.processDevServerResponse({ cmds: commands });
      expect(result).toEqual(instance);
      expect(mockedEventCall).toHaveBeenCalledTimes(5);

      const [
        pipelineResponse,
        httpResponse,
        dataResponse,
        webStorageResponse,
        unknownResponse,
      ] = mockedEventCall.mock.calls;

      expect(pipelineResponse[0]).toBe('pipelineResponse');
      expect(pipelineResponse[1]).toHaveLength(3);
      expect(pipelineResponse[1][1]).toBe(serial);

      expect(httpResponse[0]).toBe('httpResponse');
      expect(httpResponse[1]).toHaveLength(3);
      expect(httpResponse[1][1]).toBe(serial);

      expect(dataResponse[0]).toBe('dataResponse');
      expect(dataResponse[1]).toHaveLength(4);
      expect(dataResponse[1][0]).toBe(serial);

      expect(webStorageResponse[0]).toBe('webStorageResponse');
      expect(webStorageResponse[1]).toHaveLength(3);
      expect(webStorageResponse[1][0]).toBe(serial);

      expect(unknownResponse[0]).toBe('unknownResponse');
      expect(unknownResponse[1]).toHaveLength(0);
    });

    it('should work as expected when nothing was passed', () => {
      const result = instance.processDevServerResponse(null);
      expect(result).toEqual(instance);
      expect(mockedEventCall).toHaveBeenCalledTimes(0);
    });
  });
});
