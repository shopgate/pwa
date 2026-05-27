import React from 'react';
import { render, screen } from '@shopgate/pwa-unit-test/rtlUtils';
import { StoreContext } from '../Store.context';
import { StoreDetails } from '../StoreDetails';

jest.mock('@shopgate/engage/components');
jest.mock('../../StockInfo/', () => function StockInfo() { return null; });

describe('engage > locations > StoreList > StoreDetails', () => {
  const store = {
    name: 'ACME',
    distance: 5.3,
    unitSystem: 'system',
    productInventory: {
      isAvailable: true,
      visible: 10,
    },
    operationHours: {
      sun: '09:00 - 17:00',
      mon: '09:00 - 17:00',
    },
    address: {
      code: 'code',
      street: 'Marktplatz 12',
      street2: null,
      street3: null,
      street4: null,
      postalCode: '35510',
      city: 'Butzbach',
      region: 'HE',
      country: 'DE',
      phoneNumber: '06033123',
    },
  };

  it('should render as expected', () => {
    render((
      <StoreContext.Provider value={store}>
        <StoreDetails />
      </StoreContext.Provider>
    ));

    expect(screen.getByRole('row', { name: 'locations.mon: 09:00 - 17:00' })).toBeTruthy();
    expect(screen.getByRole('row', { name: 'locations.sun: 09:00 - 17:00' })).toBeTruthy();

    const phoneLink = screen.getByRole('link', { name: /locations.phone: 06033123/i });
    expect(phoneLink.getAttribute('href')).toEqual('tel:06033123');

    expect(screen.getByText('Marktplatz 12')).toBeTruthy();
    expect(screen.getByText('06033123')).toBeTruthy();
    expect(document.body).toHaveTextContent('locations.address');
    expect(document.body).toHaveTextContent('locations.map_open');
  });
});
