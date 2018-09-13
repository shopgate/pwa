import React from 'react';
import { shallow } from 'enzyme';
import NavDrawer from './index';

describe('NavDrawer', () => {
  it('should match the snapshot', () => {
    const wrapper = shallow(<NavDrawer>Content</NavDrawer>);

    expect(wrapper).toMatchSnapshot();
  });

  it('should open and close with an event', () => {
    const wrapper = shallow(<NavDrawer>Content</NavDrawer>);

    NavDrawer.open();
    expect(wrapper.state().open).toEqual(true);

    NavDrawer.close();
    expect(wrapper.state().open).toEqual(false);
  });

  it('should close when Backdrop is clicked', () => {
    const wrapper = shallow(<NavDrawer>Content</NavDrawer>);
    const backdrop = wrapper.find('Backdrop');

    NavDrawer.open();
    expect(wrapper.state().open).toEqual(true);

    backdrop.simulate('click');
    expect(wrapper.state().open).toEqual(false);
  });
});
