import AppCommand from './index';

// Mock of the error logger.
const mockedErrorLogger = jest.fn();
const mockedWarnLogger = jest.fn();
const mockedGroupLogger = jest.fn();
jest.mock('../../helpers', () => ({
  logger: {
    error: (...args) => {
      mockedErrorLogger(...args);
    },
    warn: (...args) => {
      mockedWarnLogger(...args);
    },
    log: () => {},
    groupCollapsed: (...args) => {
      mockedGroupLogger(...args);
    },
    groupEnd: () => {},
  },
  hasSGJavaScriptBridge: () => false,
}));

// Mock of the DevServer bridge.
let mockedBridgeDispatch = jest.fn();
jest.mock('../DevServerBridge', () => () => ({ dispatchCommandsForVersion: mockedBridgeDispatch }));

// Mock of the client information web storage.
let mockedClientInformation = null;
jest.mock('../../commands/webStorage', () => ({
  getWebStorageEntry: () => ({
    then(cb) {
      cb({ value: mockedClientInformation });
    },
  }),
}));

const defaultLibVersion = '17.0';

/**
 * Updates the mocked client information.
 * @param {string} libVersion The libVersion.
 */
const setClientInformation = (libVersion = defaultLibVersion) => {
  mockedClientInformation = {
    libVersion,
  };
};

describe('AppCommand', () => {
  let instance;

  beforeEach(() => {
    setClientInformation();
    mockedErrorLogger.mockClear();
    mockedWarnLogger.mockClear();
    mockedGroupLogger.mockClear();
    mockedBridgeDispatch.mockClear();
    instance = new AppCommand();
  });

  describe('.constructor()', () => {
    it('should construct as expected without parameters', () => {
      expect(instance.log).toBe(true);
      expect(instance.checkLibVersion).toBe(true);
    });

    it('should construct as expected when log parameter is false', () => {
      instance = new AppCommand(false, false);
      expect(instance.log).toBe(false);
      expect(instance.checkLibVersion).toBe(false);
    });
  });

  describe('.setCommandName()', () => {
    it('should set a valid value', () => {
      const value = 'sendPipelineRequest';
      const command = instance.setCommandName(value);
      expect(command).toEqual(instance);
      expect(command.name).toEqual(value);
    });

    it('should not set an invalid value', () => {
      const initial = instance.name;
      const command = instance.setCommandName(17.3);
      expect(command).toEqual(instance);
      expect(command.name).toEqual(initial);
      expect(mockedErrorLogger.mock.calls.length).toBe(1);
    });
  });

  describe('.setCommandParams()', () => {
    it('should set a valid value', () => {
      const value = {
        paramOne: 'foo',
        paramTwo: 1337,
      };
      const command = instance.setCommandParams(value);
      expect(command).toEqual(instance);
      expect(command.params).toEqual(value);
    });

    it('should not set an invalid value', () => {
      const initial = instance.params;
      const command = instance.setCommandParams('sendPipelineRequest');
      expect(command).toEqual(instance);
      expect(command.params).toEqual(initial);
      expect(mockedErrorLogger.mock.calls.length).toBe(1);
    });
  });

  describe('.setLibVersion()', () => {
    it('should set a valid value', () => {
      const value = '17.2';
      const command = instance.setLibVersion(value);
      expect(command).toEqual(instance);
      expect(command.libVersion).toEqual(value);
    });

    it('should not set an invalid value', () => {
      const initial = instance.libVersion;
      const command = instance.setLibVersion('sendPipelineRequest');
      expect(command).toEqual(instance);
      expect(command.libVersion).toEqual(initial);
      expect(mockedErrorLogger.mock.calls.length).toBe(1);
    });
  });

  describe('.logCommand', () => {
    it('should log a command', () => {
      instance.setCommandName('openPage');
      const command = instance.logCommand();
      expect(command).toEqual(instance);
      expect(mockedGroupLogger.mock.calls.length).toBe(1);
    });

    it('should not log a command when logging is turned off', () => {
      instance = new AppCommand(false);
      instance.setCommandName('openPage');
      const command = instance.logCommand();
      expect(command).toEqual(instance);
      expect(mockedGroupLogger.mock.calls.length).toBe(0);
    });

    it('should not log a command when it is blacklisted', () => {
      instance.setCommandName('sendPipelineRequest');
      const command = instance.logCommand();
      expect(command).toEqual(instance);
      expect(mockedGroupLogger.mock.calls.length).toBe(0);
    });
  });

  describe('.buildCommand()', () => {
    it('should build a command when name and params are set', () => {
      const name = 'sendPipelineRequest';
      const params = {
        paramOne: 'foo',
        paramTwo: 1337,
      };

      const expected = {
        c: name,
        p: params,
      };

      instance.setCommandName(name);
      instance.setCommandParams(params);

      const result = instance.buildCommand();
      expect(result).toEqual(expected);
    });

    it('should build a command when only the name is set', () => {
      const name = 'sendPipelineRequest';

      const expected = {
        c: name,
      };

      instance.setCommandName(name);

      const result = instance.buildCommand();
      expect(result).toEqual(expected);
    });

    it('should not build a command when no name is set', () => {
      const params = {
        paramOne: 'foo',
        paramTwo: 1337,
      };

      instance.setCommandParams(params);

      const result = instance.buildCommand();
      expect(result).toEqual(null);
    });
  });

  describe('.dispatch()', () => {
    it('should dispatch as expected', async () => {
      const name = 'sendPipelineRequest';
      instance.setCommandName(name);
      const result = await instance.dispatch();
      expect(result).toBe(true);
      expect(mockedBridgeDispatch.mock.calls.length).toBe(1);
      expect(mockedBridgeDispatch.mock.calls[0][0][0].c).toBe(name);
      expect(mockedBridgeDispatch.mock.calls[0][1]).toBe(defaultLibVersion);
      expect(mockedErrorLogger.mock.calls.length).toBe(0);
      expect(mockedWarnLogger.mock.calls.length).toBe(0);
    });

    it('should set the params if passed to dispatch', async () => {
      const params = {
        paramOne: 'foo',
        paramTwo: 1337,
      };

      instance.setCommandName('sendPipelineRequest');
      const result = await instance.dispatch(params);
      expect(result).toBe(true);
      expect(mockedBridgeDispatch.mock.calls.length).toBe(1);
      expect(mockedBridgeDispatch.mock.calls[0][0][0].p).toEqual(params);
      expect(mockedErrorLogger.mock.calls.length).toBe(0);
      expect(mockedWarnLogger.mock.calls.length).toBe(0);
    });

    it('should not dispatch when no command was set up', async () => {
      const result = await instance.dispatch();
      expect(result).toBe(false);
      expect(mockedBridgeDispatch.mock.calls.length).toBe(0);
      expect(mockedErrorLogger.mock.calls.length).toBe(1);
      expect(mockedWarnLogger.mock.calls.length).toBe(0);
    });

    it('should not dispatch when the command is not supported by the app', async () => {
      instance.setCommandName('sendPipelineRequest');
      instance.setLibVersion('18.0');
      const result = await instance.dispatch();
      expect(result).toBe(false);
      expect(mockedBridgeDispatch.mock.calls.length).toBe(0);
      expect(mockedErrorLogger.mock.calls.length).toBe(0);
      expect(mockedWarnLogger.mock.calls.length).toBe(1);
    });

    it('should dispatch when the command is not supported by the app but the check is off', async () => {
      const libVersion = '18.0';
      instance = new AppCommand(true, false);
      instance.setCommandName('sendPipelineRequest');
      instance.setLibVersion(libVersion);
      const result = await instance.dispatch();
      expect(result).toBe(true);
      expect(mockedBridgeDispatch.mock.calls[0][1]).toBe(libVersion);
      expect(mockedBridgeDispatch.mock.calls.length).toBe(1);
      expect(mockedErrorLogger.mock.calls.length).toBe(0);
      expect(mockedWarnLogger.mock.calls.length).toBe(0);
    });

    it('should handle errors during bridge dispatch', async () => {
      mockedBridgeDispatch = jest.fn().mockImplementation(() => {
        throw new Error();
      });

      const name = 'sendPipelineRequest';
      instance.setCommandName(name);
      const result = await instance.dispatch();
      expect(result).toBe(false);
      expect(mockedBridgeDispatch.mock.calls.length).toBe(1);
      expect(mockedErrorLogger.mock.calls.length).toBe(1);
      expect(mockedWarnLogger.mock.calls.length).toBe(0);
    });
  });
});
