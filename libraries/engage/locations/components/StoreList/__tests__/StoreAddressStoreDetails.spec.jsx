import React from 'react';
import { shallow } from 'enzyme';
import StoreAddressStoreDetails from '../StoreAddressStoreDetails';

jest.mock('../../../../components', () => ({
  Accordion: function Accordion({ children }) {
    return children;
  },
}));
jest.mock('../StoreAddressMailingAddress', () => function StoreAddressMailingAddress() { return null; });
jest.mock('../StoreAddressOpeningHours', () => function StoreAddressOpeningHours() { return null; });
jest.mock('../StoreAddressPhoneNumber', () => function StoreAddressPhoneNumber() { return null; });

describe('<StoreAddressStoreDetails />', () => {
  const store = {
    name: 'ACME',
    distance: 5.3,
    unitSystem: 'system',
    operationHours: {
      sun: '09:00 - 17:00',
      mon: '09:00 - 17:00',
    },
  };

  const address = {
    phoneNumber: '555-987654321',
  };

  it('should render as expected', () => {
    const wrapper = shallow((<StoreAddressStoreDetails store={store} address={address} />));
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('StoreAddressOpeningHours').isEmptyRender()).toEqual(false);
    expect(wrapper.find('StoreAddressMailingAddress').prop('address')).toEqual(address);
    expect(wrapper.find('StoreAddressPhoneNumber').prop('phone')).toEqual(address.phoneNumber);
  });

  it('should not render opening hours when the property does not exist within the store', () => {
    const { operationHours, ...rest } = store;
    const wrapper = shallow((<StoreAddressStoreDetails store={rest} address={address} />));
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('StoreAddressOpeningHours').isEmptyRender()).toEqual(true);
  });

  it('should not render opening hours when the object does not contain hours', () => {
    const customStore = {
      ...store,
      operationHours: {
        sun: '',
        mon: '',
      },
    };
    const wrapper = shallow((<StoreAddressStoreDetails store={customStore} address={address} />));
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('StoreAddressOpeningHours').isEmptyRender()).toEqual(true);
  });
});
