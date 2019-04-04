// eslint-disable-next-line import/named
import { mockedSetCommandName, mockedSetCommandParams, mockedDispatch } from '../../classes/AppCommand';
import openAppSettings from '../openAppSettings';

jest.mock('../../classes/AppCommand');

describe('openAppSettings command', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch', () => {
    openAppSettings();

    expect(mockedSetCommandName).toHaveBeenCalledWith('openAppSettings');
    expect(mockedSetCommandParams).not.toHaveBeenCalled();
    expect(mockedDispatch).toHaveBeenCalledWith(undefined);
  });
});
