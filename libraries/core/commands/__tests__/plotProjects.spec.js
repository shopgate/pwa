import { plotProjectsEnable, plotProjectsDisable, plotProjectsSetSegmentationProperties } from '../plotProjects';
/* eslint-disable import/named */
import {
  mockedSetCommandName,
  mockedSetLibVersion,
  mockedDispatch,
  mockedSetCommandParams,
} from '../../classes/AppCommand';
import { logger } from '../../helpers';
/* eslint-enable import/named */

jest.mock('../../classes/AppCommand');
jest.mock('../../helpers', () => ({
  logger: {
    error: jest.fn(),
  },
}));

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

  describe('plotProjectsSetSegmentationProperties()', () => {
    it('should dispatch the correct command', () => {
      const inputProperties = [
        // valid
        {
          key: 'key1',
          type: 'string',
          value: 'value1',
        },
        {
          key: 'key2',
          type: 'integer',
          value: 123,
        },
        {
          key: 'key3',
          type: null,
        },
        {
          key: 'key4',
        },
        {
          key: 'key5',
          value: null,
        },
        // invalid
        {
          key: 1,
          type: 'integer',
          value: 123,
        },
        {
          type: 'integer',
          value: 123,
        },
      ];

      const expected = {
        properties: [
          {
            key: 'key1',
            type: 'string',
            value: 'value1',
          },
          {
            key: 'key2',
            type: 'integer',
            value: 123,
          },
          {
            key: 'key3',
            type: null,
          },
          {
            key: 'key4',
          },
          {
            key: 'key5',
            value: null,
          },
        ],
      };

      plotProjectsSetSegmentationProperties(inputProperties);

      expect(mockedSetCommandName).toHaveBeenCalledTimes(1);
      expect(mockedSetCommandName).toHaveBeenCalledWith('plotProjectsSetSegmentationProperties');

      expect(mockedSetCommandParams).toHaveBeenCalledTimes(1);
      expect(mockedSetCommandParams).toHaveBeenCalledWith(expected);

      expect(mockedSetLibVersion).toHaveBeenCalledTimes(1);
      expect(mockedSetLibVersion).toHaveBeenCalledWith('25.0');

      expect(mockedDispatch).toHaveBeenCalledTimes(1);

      expect(logger.error).toHaveBeenCalledTimes(2);
    });
  });
});
