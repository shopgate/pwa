import '../__mocks__';
import { RECEIVE_PRODUCT_LOCATIONS } from '../../constants';
import receiveProductLocations from '../receiveProductLocations';

describe('engage > locations > actions-creators', () => {
  test('receiveProductLocations', () => {
    const productCode = 'id123';
    const filters = {
      productCode: 'abc123',
    };
    const locations = [{ code: 'LOC1' }, { code: 'LOC2' }];
    const result = receiveProductLocations(productCode, filters, locations);
    expect(result).toEqual({
      type: RECEIVE_PRODUCT_LOCATIONS,
      productCode,
      locations,
      filters,
    });
    expect(result).toMatchSnapshot();
  });
});
