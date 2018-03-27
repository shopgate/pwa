import React from 'react';
import { mount } from 'enzyme';
import NotSupported from './index';

describe('NotSupported', () => {
  it('should render as expected without any props', () => {
    const wrapper = mount(<NotSupported />);
    expect(wrapper).toMatchSnapshot();
  });
});
