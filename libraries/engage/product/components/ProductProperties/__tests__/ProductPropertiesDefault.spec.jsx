import React from 'react';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { getProductProperties } from '@shopgate/pwa-common-commerce/product';
import { ProductPropertiesDefault } from '../ProductPropertiesDefault';

const mockStore = configureStore();
const store = mockStore({});

jest.mock('@shopgate/pwa-common-commerce/product', () => ({
  getProductProperties: jest.fn(),
}));

describe('<ProductPropertiesDefault />', () => {
  it('should not render if no data is available', () => {
    getProductProperties.mockReturnValueOnce(null);
    const wrapper = shallow(<ProductPropertiesDefault store={store} />);
    expect(wrapper.find('table').length).toEqual(0);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render table with properties', () => {
    getProductProperties.mockReturnValueOnce([
      {
        label: 'test1',
        value: '123',
      },
      {
        label: 'test2',
        value: '456',
      },
    ]);
    const wrapper = mount(<ProductPropertiesDefault store={store} />);
    expect(wrapper.find('table').length).toEqual(1);
    expect(wrapper).toMatchSnapshot();
  });
});
