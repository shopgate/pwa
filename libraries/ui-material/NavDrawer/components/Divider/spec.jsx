import React from 'react';
import { mount } from 'enzyme';
import Divider from './index';

describe('<NavDrawerDivider />', () => {
  it('should match the snapshot', () => {
    const wrapper = mount(<Divider />);
    expect(wrapper).toMatchSnapshot();
  });
});
