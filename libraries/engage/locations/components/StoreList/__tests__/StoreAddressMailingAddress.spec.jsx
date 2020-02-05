import React from 'react';
import { shallow } from 'enzyme';
import StoreAddressMailingAddress from '../StoreAddressMailingAddress';

const dummyAddress = {
  street: 'Test Street 123',
  city: 'Testcity',
  postalCode: '12345',
  region: 'TX',
  street3: '',
};

describe('<StoreAddressMailingAddress />', () => {
  it('should not render if no address is passed in', () => {
    const wrapper = shallow(<StoreAddressMailingAddress />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance()).toEqual(null);
  });

  it('should render as expected', () => {
    const wrapper = shallow(<StoreAddressMailingAddress address={dummyAddress} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('LocationIcon')).toBeTruthy();
    expect(wrapper.find('[data-test-id="street"]').text()).toEqual(dummyAddress.street);
    expect(wrapper.find('[data-test-id="street2"]').getElements().length).toEqual(0);
    expect(wrapper.find('[data-test-id="street3"]').getElements().length).toEqual(0);
    expect(wrapper.find('[data-test-id="street4"]').getElements().length).toEqual(0);
    expect(wrapper.find('Translate')).toBeTruthy();
  });

  it('should render more streets if necessary', () => {
    const wrapper = shallow(<StoreAddressMailingAddress
      address={{
        ...dummyAddress,
        street2: 'Some additional street info',
      }}
    />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('LocationIcon')).toBeTruthy();
    expect(wrapper.find('[data-test-id="street"]').text()).toEqual(dummyAddress.street);
    expect(wrapper.find('[data-test-id="street2"]').text()).toEqual('Some additional street info');
    expect(wrapper.find('[data-test-id="street3"]').getElements().length).toEqual(0);
    expect(wrapper.find('[data-test-id="street4"]').getElements().length).toEqual(0);
    expect(wrapper.find('Translate')).toBeTruthy();
  });
});
