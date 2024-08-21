import React from 'react';
import { shallow } from 'enzyme';
import { hasNewServices } from '@shopgate/engage/core/helpers';
import { Availability } from '@shopgate/engage/components';
import { StockInfoLists } from '@shopgate/engage/locations/components';
import ItemDetails from './index';

jest.mock('@shopgate/engage/product', () => ({
  MapPriceHint: () => null,
  OrderQuantityHint: () => null,
  EffectivityDates: () => null,
  Swatches: () => null,
  getProductRoute: () => '',
  AVAILABILITY_STATE_OK: 'AVAILABILITY_STATE_OK',
  AVAILABILITY_STATE_ALERT: 'AVAILABILITY_STATE_ALERT',
}));
jest.mock('@shopgate/engage/locations/components', () => ({
  StockInfoLists: () => null,
}));
jest.mock('@shopgate/engage/core/helpers', () => ({
  hasNewServices: jest.fn().mockReturnValue(false),
  i18n: {
    text: str => str,
  },
}));
jest.mock('@shopgate/engage/components');
jest.mock('@shopgate/engage/core');
jest.mock('../ItemName');
jest.mock('../ItemPrice');

describe('<ItemDetails />', () => {
  const props = {
    product: {
      id: '1234',
      name: 'Foo',
      price: {},
    },
  };

  const display = {
    name: false,
    price: false,
    reviews: false,
  };

  it('should render with minimal props', () => {
    const wrapper = shallow(<ItemDetails {...props} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Availability).exists()).toBe(false);
    expect(wrapper.find(StockInfoLists).exists()).toBe(false);
  });

  it('should render additional components with new services', () => {
    hasNewServices.mockReturnValueOnce(true);
    const wrapper = shallow(<ItemDetails {...props} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Availability).exists()).toBe(true);
    expect(wrapper.find(StockInfoLists).exists()).toBe(true);
  });

  it('should not render with display props set', () => {
    const wrapper = shallow(<ItemDetails {...props} display={display} />);
    expect(wrapper).toBeEmptyRender();
  });
});
