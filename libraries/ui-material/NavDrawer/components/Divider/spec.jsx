import React from 'react';
import { mount } from 'enzyme';
import Divider from './index';

describe('NavDrawer Divider', () => {
  it('should match the snapshot', () => {
    const wrapper = mount(<Divider />);
    expect(wrapper).toMatchSnapshot();
  });
});
