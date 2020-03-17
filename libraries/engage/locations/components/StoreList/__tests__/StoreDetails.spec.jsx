import React from 'react';
import { mount } from 'enzyme';
import { StoreContext } from '../Store.context';
import { StoreDetails } from '../StoreDetails';

jest.mock('@shopgate/engage/components');

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
    const wrapper = mount((
      <StoreContext.Provider value={store}>
        <StoreDetails />
      </StoreContext.Provider>
    ));
    expect(wrapper).toMatchSnapshot();
  });
});
