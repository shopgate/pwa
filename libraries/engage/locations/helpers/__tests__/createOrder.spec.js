import { mockedProducts } from '@shopgate/pwa-common-commerce/product/mock';
import { makeGetUserLocation } from '../../selectors';
import createOrder from '../createOrder';

jest.mock('@shopgate/engage/core');
jest.mock('@shopgate/engage/cart');
jest.mock('@shopgate/engage/product');
jest.mock('@shopgate/pwa-common/helpers/config');
jest.mock('../../selectors', () => ({
  makeGetUserLocation: jest.fn(),
}));

describe('libraries > engage > locations > helpers > createOrder', () => {
  const getState = jest.fn();
  const formValues = {
    firstName: 'firstName',
    lastName: 'lastName',
    cellPhone: 'cellPhone',
    email: 'email',
    firstName2: 'firstName2',
    lastName2: 'lastName2',
    cellPhone2: 'cellPhone2',
    email2: 'email2',
  };

  it('should create order for single product', () => {
    makeGetUserLocation.mockImplementation(() => jest.fn().mockReturnValue({
      code: 'LOCATION_CODE',
    }));
    getState.mockReturnValueOnce({ user: { data: {} } });
    expect(createOrder(formValues, mockedProducts.products[0], getState)).toMatchSnapshot();

    getState.mockReturnValueOnce({ user: { data: { id: 123456 } } });
    expect(createOrder(formValues, mockedProducts.products[0], getState)).toMatchSnapshot();
  });

  it('should create order for cart items', () => {
    getState.mockReturnValueOnce({ user: { data: {} } });
    expect(createOrder(formValues, null, getState)).toMatchSnapshot();

    getState.mockReturnValueOnce({ user: { data: { id: 123456 } } });
    expect(createOrder(formValues, null, getState)).toMatchSnapshot();
  });
});
