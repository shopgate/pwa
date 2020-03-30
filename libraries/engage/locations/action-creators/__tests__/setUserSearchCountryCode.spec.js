import '../__mocks__';
import { SET_USER_SEARCH_COUNTRY_CODE } from '../../constants';
import setUserSearchCountryCode from '../setUserSearchCountryCode';

describe('engage > locations > actions-creators', () => {
  test('setUserSearchCountryCode', () => {
    const result = setUserSearchCountryCode('DE');
    expect(result).toEqual({
      type: SET_USER_SEARCH_COUNTRY_CODE,
      countryCode: 'DE',
    });
  });
});
