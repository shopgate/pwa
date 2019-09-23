import getTranslator from './getTranslator';

jest.mock('./messageCache', () => ({}));

describe('getTranslator', () => {
  const translate = getTranslator({
    common: {
      cancel: 'Cancel',
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
});
