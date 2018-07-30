const mockedMessageCache = {};
jest.mock('./messageCache', () => mockedMessageCache);

describe('getNumberFormatter', () => {
  const CACHE_KEY = 'en-US_number_fr_2';
  let getNumberFormatter;
  beforeAll(() => {
    // eslint-disable-next-line global-require
    getNumberFormatter = require('./getNumberFormatter').default;
  });

  it('should try to format a number', () => {
    const result = getNumberFormatter('en-US', 1, 2);
    expect(result).toBe('1.00');
    expect(mockedMessageCache[CACHE_KEY].format({ value: 1 })).toBe('1.00');
  });

  it('should use cache', () => {
    // Changing the cached instance to check if it really uses cache.
    mockedMessageCache[CACHE_KEY] = { format: () => 100 };
    expect(getNumberFormatter('en-US', 1, 2)).toBe(100);
  });
});
