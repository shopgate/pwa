import React from 'react';
import { shallow } from 'enzyme';
import ItemPrice from './index';

jest.mock('@shopgate/engage/product', () => ({
  ProductGridPrice: () => null,
}));

const props = {
  productId: '1234',
  price: {},
};

const display = {
  price: false,
};

describe('<ItemPrice />', () => {
  it('should render with minimal props', () => {
    const wrapper = shallow(<ItemPrice {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render with display props set', () => {
    const wrapper = shallow(<ItemPrice {...props} display={display} />);
    expect(wrapper).toBeEmptyRender();
  });
});
