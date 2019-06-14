import { i18n } from './i18n';

describe('i18n', () => {
  const methods = ['text', 'price', 'date', 'time', 'number'];
  methods.forEach((m) => {
    it(`should throw when i18n.${m} is used before init`, () => {
      expect(() => i18n[m]()).toThrow();
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
    expect(i18n.time(new Date(0).getDate())).toBe('1:00:00 AM');
    expect(i18n.number(1000, 2)).toBe('1,000.00');
  });
});
