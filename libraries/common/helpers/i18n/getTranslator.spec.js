import getTranslator from './getTranslator';

jest.mock('./messageCache', () => ({}));

describe('getTranslator', () => {
  const translate = getTranslator({
    common: {
      cancel: 'Cancel',
      withDate: 'Date: {date, date, yyyyMMdd}',
      withPlaceholder: 'Company: {placeholder}',
    },
  }, 'en-US');

  it('should get common.cancel string', () => {
    const result = translate('common.cancel');
    expect(result).toEqual('Cancel');
  });

  it('should return not string type', () => {
    const result = translate({ id: 1 });
    expect(result).toEqual({ id: 1 });
  });

  it('should return original nullable key', () => {
    const result = translate(null);
    expect(result).toEqual(null);
  });

  it('should return original undefined key', () => {
    const result = translate(undefined);
    expect(result).toEqual(undefined);
  });

  it('should render a string with a date', () => {
    const result = translate('common.withDate', { date: '2020-09-09T14:22:08.000Z' });
    expect(result).toEqual('Date: 9/9/2020');
  });

  it('should render a string with a placeholder', () => {
    const result = translate('common.withPlaceholder', { placeholder: 'ACME' });
    expect(result).toEqual('Company: ACME');
  });
});
