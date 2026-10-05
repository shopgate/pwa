/* eslint-disable global-require, extra-rules/no-single-line-objects */
import {
  render, screen, fireEvent, act,
} from '@testing-library/react';

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

jest.mock('@shopgate/engage/a11y/components');

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
  it('should render its content in a closed drawer', () => {
    render(<NavDrawer>Content</NavDrawer>);

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    expect(screen.getByRole('navigation', { hidden: true })).toHaveTextContent('Content');
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });

  it('should open and close with an event', () => {
    const onOpen = jest.fn();
    const onClose = jest.fn();

    render((
      <NavDrawer onOpen={onOpen} onClose={onClose}>
        Content
      </NavDrawer>
    ));

    act(() => { NavDrawer.open(); });
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    expect(onOpen).toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();

    act(() => { NavDrawer.close(); });
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    expect(onClose).toHaveBeenCalled();
  });

  it('should close when Backdrop is clicked', () => {
    const onClose = jest.fn();

    render(<NavDrawer onClose={onClose}>Content</NavDrawer>);

    act(() => { NavDrawer.open(); });

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    expect(onClose).toHaveBeenCalled();
  });
});
/* eslint-enable global-require, extra-rules/no-single-line-objects */
