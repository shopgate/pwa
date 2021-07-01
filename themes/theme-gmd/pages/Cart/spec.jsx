import React from 'react';
import { shallow } from 'enzyme';
import Cart from '.';

describe('<Cart> page', () => {
  it('should match snapshot', () => {
    const component = shallow(<Cart />);
    expect(component).toMatchSnapshot();
  });
});
