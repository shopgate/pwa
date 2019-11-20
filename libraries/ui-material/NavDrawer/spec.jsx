import React from 'react';
import { shallow, mount } from 'enzyme';
import NavDrawer from './index';

jest.unmock('@shopgate/pwa-core');

describe('NavDrawer', () => {
  it('should match the snapshot', () => {
    const wrapper = shallow(<NavDrawer>Content</NavDrawer>);

    expect(wrapper).toMatchSnapshot();
  });

  it('should open and close with an event', () => {
    const onOpen = jest.fn();
    const onClose = jest.fn();

    const wrapper = mount((
      <NavDrawer onOpen={onOpen} onClose={onClose}>
        Content
      </NavDrawer>
    ));

    NavDrawer.open();
    expect(wrapper.state().open).toEqual(true);
    expect(onOpen).toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();

    NavDrawer.close();
    expect(wrapper.state().open).toEqual(false);
    expect(onClose).toHaveBeenCalled();
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
