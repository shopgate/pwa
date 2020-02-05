import { REQUEST_PRODUCT_LOCATIONS } from '../../constants';
import requestProductLocations from '../requestProductLocations';

describe('engage > locations > actions-creators', () => {
  test('requestProductLocations', () => {
    const result = requestProductLocations('id123');
    expect(result).toEqual({
      type: REQUEST_PRODUCT_LOCATIONS,
      productId: 'id123',
    });
    expect(result).toMatchSnapshot();
  });
});
