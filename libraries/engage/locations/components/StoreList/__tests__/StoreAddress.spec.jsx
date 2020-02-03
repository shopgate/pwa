import React from 'react';
import { mount } from 'enzyme';
import FulfillmentContext from '../../context';
import StoreContext from '../Store.context';
import StoreAddress from '../StoreAddress';

const addresses = [
  {
    code: 'address',
    phoneNumber: '000-000-0000',
  },
];

const store = {
  code: 'store',
  name: 'SomeStore',
  operationHours: {
    mon: '8:00am - 4:00pm',
  },
  productInventory: {
    visible: 10,
  },
  addresses,
};

const context = {
  selectLocation: jest.fn(),
};

describe.skip('<StoreAddress />', () => {
  it('should not render if no store is passed', () => {
    const wrapper = mount((
      <FulfillmentContext.Provider value={context}>
        <StoreContext.Provider value={store}>
          <StoreAddress address={addresses} />
        </StoreContext.Provider>
      </FulfillmentContext.Provider>
    ));
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance()).toEqual(null);
  });

  it('should render as expected', () => {
    const wrapper = mount((
      <FulfillmentContext.Provider value={context}>
        <StoreContext.Provider value={store}>
          <StoreAddress address={addresses} />
        </StoreContext.Provider>
      </FulfillmentContext.Provider>
    ));
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('[data-test-id="store-name"]').text()).toEqual(store.name);
    expect(wrapper.find('StoreAddressHoursToday').props().hours).toEqual(store.operationHours);
    expect(wrapper.find('StoreAddressOpeningHours').props().hours).toEqual(store.operationHours);
    expect(wrapper.find('StoreAddressMailingAddress').props().address).toEqual(store.addresses[0]);
    expect(wrapper.find('StoreAddressPhoneNumber').props().phone).toEqual(store.addresses[0].phoneNumber);
  });

  it('should handle the store selection', () => {
    const wrapper = mount((
      <FulfillmentContext.Provider value={context}>
        <StoreContext.Provider value={store}>
          <StoreAddress address={addresses} />
        </StoreContext.Provider>
      </FulfillmentContext.Provider>
    ));
    expect(wrapper).toMatchSnapshot();
    wrapper.find('div[role="button"]').simulate('click');
    expect(context.selectLocation).toHaveBeenCalledWith({
      code: store.code,
      name: store.name,
      addressCode: store.addresses[0].code,
      visibleInventory: store.productInventory.visible,
    });
  });
});
