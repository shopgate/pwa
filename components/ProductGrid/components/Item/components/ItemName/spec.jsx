import React from 'react';
import { shallow } from 'enzyme';
import ItemName from './index';

const props = {
  productId: '1234',
  name: 'Foo',
};

const display = {
  name: false,
};

describe('<ItemName />', () => {
  it('should render with minimal props', () => {
    const wrapper = shallow(<ItemName {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render with display props set', () => {
    const wrapper = shallow(<ItemName {...props} display={display} />);
    expect(wrapper).toBeEmptyRender();
  });
});
