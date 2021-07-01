import React from 'react';
import { shallow } from 'enzyme';
import ItemDetails from './index';

jest.mock('@shopgate/engage/product', () => ({
  MapPriceHint: () => null,
  OrderQuantityHint: () => null,
  EffectivityDates: () => null,
  Swatches: () => null,
}));
jest.mock('../ItemName');
jest.mock('../ItemPrice');

describe('<ItemDetails />', () => {
  const props = {
    productId: '1234',
    name: 'Foo',
    price: {},
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
