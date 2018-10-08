import React from 'react';
import { shallow } from 'enzyme';
import ItemDetails from './index';

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

describe('<ItemDetails />', () => {
  it('should render with minimal props', () => {
    const wrapper = shallow(<ItemDetails {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render with display props set', () => {
    const wrapper = shallow(<ItemDetails {...props} display={display} />);
    expect(wrapper).toMatchSnapshot();
  });
});
