import { plotProjectsEnable, plotProjectsDisable } from '../plotProjects';
// eslint-disable-next-line import/named
import { mockedSetCommandName, mockedSetLibVersion, mockedDispatch } from '../../classes/AppCommand';

jest.mock('../../classes/AppCommand');

describe('plotprojects commands', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('plotProjectsEnable()', () => {
    it('should dispatch the correct command', () => {
      const token = 'foo123';

      plotProjectsEnable(token);

      expect(mockedSetCommandName).toHaveBeenCalledTimes(1);
      expect(mockedSetCommandName).toHaveBeenCalledWith('plotProjectsEnable');

      expect(mockedSetLibVersion).toHaveBeenCalledTimes(1);
      expect(mockedSetLibVersion).toHaveBeenCalledWith('18.0');

      expect(mockedDispatch).toHaveBeenCalledTimes(1);
      expect(mockedDispatch).toHaveBeenCalledWith({
        publicToken: token,
      });
    });
  });

  describe('plotProjectsDisable()', () => {
    it('should dispatch the correct command', () => {
      plotProjectsDisable();

      expect(mockedSetCommandName).toHaveBeenCalledTimes(1);
      expect(mockedSetCommandName).toHaveBeenCalledWith('plotProjectsDisable');

      expect(mockedSetLibVersion).toHaveBeenCalledTimes(1);
      expect(mockedSetLibVersion).toHaveBeenCalledWith('18.0');

      expect(mockedDispatch).toHaveBeenCalledTimes(1);
    });
  });
});
