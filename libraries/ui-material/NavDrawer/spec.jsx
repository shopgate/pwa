import React from 'react';
import { shallow } from 'enzyme';
import { UIEvents } from '@shopgate/pwa-core';
import NavDrawer from './index';

describe('NavDrawer', () => {
  it('should match the snapshot', () => {
    const wrapper = shallow(<NavDrawer />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should open and close with an event', () => {
    const wrapper = shallow(<NavDrawer />);

    UIEvents.emit(NavDrawer.OPEN);
    expect(wrapper.state().open).toEqual(true);

    UIEvents.emit(NavDrawer.CLOSE);
    expect(wrapper.state().open).toEqual(false);
  });

  it('should close when Backdrop is clicked', () => {
    const wrapper = shallow(<NavDrawer />);
    const backdrop = wrapper.find('Backdrop');

    backdrop.simulate('click');

    expect(wrapper.state().open).toEqual(false);
  });
});
