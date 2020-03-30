import '../__mocks__';
import { ERROR_PRODUCT_LOCATIONS } from '../../constants';
import errorProductLocations from '../errorProductLocations';

describe('engage > locations > actions-creators', () => {
  test('errorProductLocations', () => {
    const result = errorProductLocations('id123', 'error123');
    expect(result).toEqual({
      type: ERROR_PRODUCT_LOCATIONS,
      productId: 'id123',
      errorCode: 'error123',
    });
    expect(result).toMatchSnapshot();
  });
});
