import '../__mocks__';
import { SET_USER_SEARCH_POSTAL_CODE } from '../../constants';
import setUserSearchPostalCode from '../setUserSearchPostalCode';

describe('engage > locations > actions-creators', () => {
  test('setUserSearchPostalCode with a string', () => {
    const result = setUserSearchPostalCode('35510');
    expect(result).toEqual({
      type: SET_USER_SEARCH_POSTAL_CODE,
      postalCode: '35510',
    });
  });

  test('setUserSearchPostalCode with null', () => {
    const result = setUserSearchPostalCode(null);
    expect(result).toEqual({
      type: SET_USER_SEARCH_POSTAL_CODE,
      postalCode: null,
    });
  });
});
