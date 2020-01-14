import { i18n } from '../i18n';

jest.unmock('../i18n');

const mockedWarn = jest.fn();
const mockedError = jest.fn();
jest.mock('@shopgate/pwa-core/helpers', () => ({
  logger: {
    warn: (...args) => mockedWarn(...args),
    error: (...args) => mockedError(...args),
  },
}));

describe('i18n', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const methods = ['text', 'price', 'date', 'time', 'number'];
  methods.forEach((m) => {
    it(`should log error when i18n.${m} is used before init`, () => {
      i18n[m]();
      expect(mockedError).toHaveBeenCalled();
    });
  });

  it('should translate', () => {
    const locales = {
      test: {
        string: 'Test string: {bar}',
      },
    };

    i18n.init({
      locales,
      lang: 'en-US',
    });

    expect(i18n.text('test.string', { bar: 'testProperty' })).toBe('Test string: testProperty');
    expect(i18n.price(1000, 'USD', 2)).toBe('$1,000.00');
    expect(i18n.date(new Date(0).getDate())).toBe('Jan 1, 1970');
    expect(i18n.time(new Date(0).getDate()).match(/PM|AM/).length).toBe(1);
    expect(i18n.number(1000, 2)).toBe('1,000.00');
  });

  it('should consider a custom currency locale', () => {
    i18n.init({
      locales: {},
      lang: 'en-US',
      priceLocale: 'en-IL',
    });

    expect(i18n.price(1000, 'EUR', 2)).toBe('€1,000.00');
  });

  it('should warn on another init', () => {
    i18n.init({});
    expect(mockedWarn).toHaveBeenCalled();
  });
});
