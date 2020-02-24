import React from 'react';
import { shallow } from 'enzyme';
import StoreAddressHeading from '../StoreAddressHeading';

jest.mock('../StoreAddressDistance', () => function StoreAddressDistance() {
  return null;
});

describe('<StoreAddressHeading>', () => {
  it('should render as expected', () => {
    const store = {
      name: 'ACME',
      distance: 5.3,
      unitSystem: 'system',
    };
    const wrapper = shallow((<StoreAddressHeading store={store} />));
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('div[data-test-id="store-name"]').text()).toEqual(store.name);
    expect(wrapper.find('StoreAddressDistance').props()).toEqual({
      distance: store.distance,
      unitSystem: store.unitSystem,
    });
  });
});
