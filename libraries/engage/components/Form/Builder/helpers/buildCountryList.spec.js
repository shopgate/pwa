import buildCountryList from './buildCountryList';

jest.mock('@shopgate/pwa-core/helpers', () => ({
  logger: {
    error: () => {},
  },
}));

const countryElement = {
  countries: ['DE', 'US'],
};

describe('Builder/helpers/buildCountryList', () => {
  it('should return empty list when config is wrong', () => {
    expect(buildCountryList({ countries: '' })).toEqual({});
  });

  it('should return list with 2 countries', () => {
    const expected = {
      DE: 'Germany',
      US: 'United States',
    };
    expect(buildCountryList(countryElement)).toEqual(expected);
  });

  it('should return list with 2 countries and optional on top', () => {
    const expected = {
      '': '',
      DE: 'Germany',
      US: 'United States',
    };
    expect(buildCountryList(countryElement, { '': '' })).toEqual(expected);
  });

  it('should ignore unknown countries', () => {
    const expected = {
      DE: 'Germany',
    };
    expect(buildCountryList({ countries: ['DE', 'XX'] })).toEqual(expected);
  });
});
