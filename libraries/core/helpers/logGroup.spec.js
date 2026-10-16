import { logger } from './index';
import logGroup from './logGroup';

jest.mock('./index', () => ({
  logger: {
    groupCollapsed: jest.fn(),
    log: jest.fn(),
    groupEnd: jest.fn(),
  },
}));

describe('logGroup()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should pass one style for each placeholder of the title', () => {
    logGroup('Title', {}, 'red');

    const [[title, ...styles]] = logger.groupCollapsed.mock.calls;

    expect(title).toMatch(/^ %cTitle %c@ %c\d{2}:\d{2}:\d{2}\.\d{3}$/);
    expect(styles).toHaveLength(title.split('%c').length - 1);
    expect(styles[0]).toBe('color: red; font-weight: lighter;');
  });

  it('should log each value of the content and close the group', () => {
    logGroup('Title', {
      first: 1,
      second: 'two',
    });

    expect(logger.log).toHaveBeenCalledTimes(2);
    expect(logger.log).toHaveBeenCalledWith(' %c first:   ', 'color: gray; font-weight: bold;', 1);
    expect(logger.groupEnd).toHaveBeenCalledTimes(1);
  });
});
