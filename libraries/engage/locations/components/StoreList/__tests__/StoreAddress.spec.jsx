import React from 'react';
import { render, screen } from '@shopgate/pwa-unit-test/rtlUtils';
import { FulfillmentContext } from '../../../locations.context';
import { StoreContext } from '../Store.context';
import { StoreAddress } from '../StoreAddress';

/* eslint-disable react/prop-types */

jest.mock('../../../../components', () => ({
  LocationIcon: () => <span data-testid="location-icon" />,
}));

jest.mock('@shopgate/engage/core/helpers', () => ({
  i18n: {
    text: jest.fn(() => 'locations.address'),
  },
}));

jest.mock('../../StockInfo', () => ({
  StockInfo: ({ location }) => <div data-testid="stock-info">{location?.name}</div>,
}));

const address = {
  street: 'Main St 1',
  street2: 'Building A',
  street3: '',
  street4: null,
  city: 'Town',
  postalCode: '12345',
};

const store = {
  code: 'store',
  name: 'SomeStore',
  address,
};

describe.skip('<StoreAddress />', () => {
  it('should not render if no address is passed', () => {
    const { container } = render((
      <FulfillmentContext.Provider value={{ product: null }}>
        <StoreContext.Provider value={store}>
          <StoreAddress address={null} />
        </StoreContext.Provider>
      </FulfillmentContext.Provider>
    ));

    expect(container.firstChild).toBeNull();
  });

  it('should render the store address', () => {
    render((
      <FulfillmentContext.Provider value={{ product: { id: 'p1' } }}>
        <StoreContext.Provider value={store}>
          <StoreAddress address={address} />
        </StoreContext.Provider>
      </FulfillmentContext.Provider>
    ));

    expect(screen.getByTestId('location-icon')).toBeTruthy();
    expect(screen.getByText('Main St 1')).toBeTruthy();
    expect(screen.getByText('Building A')).toBeTruthy();
    expect(screen.getByText('locations.address')).toBeTruthy();
    expect(screen.getByTestId('stock-info')).toHaveTextContent('SomeStore');
  });

  it('should not render stock info without product in context', () => {
    render((
      <FulfillmentContext.Provider value={{ product: null }}>
        <StoreContext.Provider value={store}>
          <StoreAddress address={address} />
        </StoreContext.Provider>
      </FulfillmentContext.Provider>
    ));

    expect(screen.queryByTestId('stock-info')).toBeNull();
  });
});

/* eslint-enable react/prop-types */
