import React from 'react';
import { mount } from 'enzyme';
import CouponsHint from './index';

describe('<CouponsHint />', () => {
  it('should render as expected without any props', () => {
    const wrapper = mount(<CouponsHint />);
    expect(wrapper).toMatchSnapshot();
  });
});
