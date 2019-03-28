import React from 'react';
import { shallow } from 'enzyme';
import GrandTotal from './';

describe('<GrandTotal />', () => {
  it('should render without issues', () => {
    const wrapper = shallow(<GrandTotal />);
    expect(wrapper).toMatchSnapshot();
  });
});
