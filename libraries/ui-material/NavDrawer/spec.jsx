/* eslint-disable global-require, extra-rules/no-single-line-objects */
import React from 'react';
import { shallow, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import Transition from 'react-transition-group/Transition';

jest.unmock('@shopgate/pwa-core');

jest.mock('@shopgate/engage/styles', () => ({
  makeStyles: () => function mockUseStylesFactory(defs) {
    return function useStylesMock() {
      const keys = Object.keys(defs);
      const classes = keys.reduce((acc, key) => {
        acc[key] = `mock-class-${key}`;
        return acc;
      }, {});
      const cx = (...parts) => parts.filter(Boolean).join(' ');
      return { classes, cx };
    };
  },
}));

jest.mock('@shopgate/engage/components', () => {
  const mockReact = require('react');
  const mockPropTypes = require('prop-types');

  function Backdrop(props) {
    const { isVisible, onClick } = props;
    if (!isVisible) {
      return null;
    }
    return mockReact.createElement('button', {
      type: 'button',
      'aria-label': 'Close',
      'data-test-id': 'NavDrawerBackdrop',
      onClick,
    });
  }
  Backdrop.propTypes = {
    isVisible: mockPropTypes.bool,
    onClick: mockPropTypes.func,
  };
  Backdrop.defaultProps = {
    isVisible: false,
    onClick: undefined,
  };
  Backdrop.displayName = 'Backdrop';
  return { Backdrop };
});

jest.mock('@shopgate/engage/a11y/components', () => {
  const mockPropTypes = require('prop-types');

  function ModalStateTracker(props) {
    return props.children;
  }
  ModalStateTracker.propTypes = {
    children: mockPropTypes.node,
  };
  ModalStateTracker.defaultProps = {
    children: null,
  };
  return { ModalStateTracker };
});

jest.mock('./components/Item', () => {
  const mockReact = require('react');
  const mockPropTypes = require('prop-types');

  const ItemWithRef = mockReact.forwardRef((props, ref) => (
    mockReact.createElement('button', {
      type: 'button',
      ref,
      'data-test-id': 'nav-drawer-item',
    }, props.label)
  ));
  ItemWithRef.propTypes = {
    label: mockPropTypes.string,
  };
  ItemWithRef.defaultProps = {
    label: '',
  };
  return { __esModule: true, default: ItemWithRef };
});

// eslint-disable-next-line import/first
import NavDrawer from './index';

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

    act(() => { NavDrawer.open(); });
    wrapper.update();
    expect(wrapper.find(Transition).prop('in')).toEqual(true);
    expect(onOpen).toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();

    act(() => { NavDrawer.close(); });
    wrapper.update();
    expect(wrapper.find(Transition).prop('in')).toEqual(false);
    expect(onClose).toHaveBeenCalled();
  });

  it('should close when Backdrop is clicked', () => {
    const wrapper = mount(<NavDrawer>Content</NavDrawer>);

    act(() => { NavDrawer.open(); });
    wrapper.update();
    expect(wrapper.find(Transition).prop('in')).toEqual(true);

    const backdrop = wrapper.find('[data-test-id="NavDrawerBackdrop"]');
    act(() => { backdrop.simulate('click'); });
    wrapper.update();
    expect(wrapper.find(Transition).prop('in')).toEqual(false);
  });
});
/* eslint-enable global-require, extra-rules/no-single-line-objects */
