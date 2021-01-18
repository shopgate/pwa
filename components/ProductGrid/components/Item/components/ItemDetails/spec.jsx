import React from 'react';
import { shallow } from 'enzyme';
import ItemDetails from './index';

jest.mock('@shopgate/engage/product', () => ({
  MapPriceHint: () => null,
  OrderQuantityHint: () => null,
  Swatches: () => null,
  getProductRoute: () => '',
  AVAILABILITY_STATE_OK: 'AVAILABILITY_STATE_OK',
  AVAILABILITY_STATE_ALERT: 'AVAILABILITY_STATE_ALERT',
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
  });

  it('should not render with display props set', () => {
    const wrapper = shallow(<ItemDetails {...props} display={display} />);
    expect(wrapper).toBeEmptyRender();
  });
});
