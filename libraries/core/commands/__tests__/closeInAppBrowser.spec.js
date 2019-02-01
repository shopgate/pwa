/* eslint-disable import/named */
import {
  mockedSetCommandName,
  mockedSetCommandParams,
  mockedBuildCommand,
  mockedDispatch,
} from '../../classes/AppCommand';
/* eslint-enable import/named */
import closeInAppBrowser from '../closeInAppBrowser';

jest.mock('../../classes/AppCommand');
jest.mock('../../helpers', () => ({
  hasSGJavaScriptBridge: () => true,
}));

describe('closeInAppBrowser command', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * The default test for a command parameter which is not set, or set to false.
   * @param {boolean} isAndroid The parameter value for the command.
   * @param {string} delayedCommand The name of the delayed command.
   */
  const execTest = (isAndroid, delayedCommand) => {
    const expectedDelayedCommand = {
      c: delayedCommand,
      p: {
        targetTab: 'in_app_browser',
      },
    };

    let actualDelayedCommand;

    mockedBuildCommand.mockImplementationOnce((command) => {
      // Intercept the command assignment.
      actualDelayedCommand = command;
      return command;
    });

    closeInAppBrowser(isAndroid);

    // Check if the correct commands where dispatched.
    expect(mockedSetCommandName).toHaveBeenCalledTimes(3);
    expect(mockedSetCommandName).toHaveBeenCalledWith(delayedCommand);
    expect(mockedSetCommandName).toHaveBeenCalledWith('performCommandsAfterDelay');
    expect(mockedSetCommandName).toHaveBeenCalledWith('showTab');

    expect(mockedBuildCommand).toHaveBeenCalledTimes(1);
    expect(actualDelayedCommand).toEqual(expectedDelayedCommand);

    expect(mockedSetCommandParams).toHaveBeenCalledWith({
      cmds: [expectedDelayedCommand],
      delay: expect.any(Number),
    });

    expect(mockedDispatch).toHaveBeenCalledTimes(2);
  };

  it('should dispatch the commands as expected without any params', () => {
    execTest(undefined, 'popTabToRoot');
  });

  it('should dispatch the commands as expected when params is set to false', () => {
    execTest(false, 'popTabToRoot');
  });

  it('should dispatch the commands as expected when params is set to true', () => {
    execTest(true, 'cleanTab');
  });
});
