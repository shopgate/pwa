import '../__mocks__';
import { RECEIVE_PRODUCT_LOCATIONS } from '../../constants';
import receiveProductLocations from '../receiveProductLocations';

describe('engage > locations > actions-creators', () => {
  test('receiveProductLocations', () => {
    const result = receiveProductLocations('id123', ['a', 'b', 'c']);
    expect(result).toEqual({
      type: RECEIVE_PRODUCT_LOCATIONS,
      productId: 'id123',
      locations: ['a', 'b', 'c'],
    });
    expect(result).toMatchSnapshot();
  });
});
