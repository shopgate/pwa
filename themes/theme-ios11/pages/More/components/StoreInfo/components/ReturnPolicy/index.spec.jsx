/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import { Portal } from '@shopgate/engage/components';
import {
  NAV_MENU_RETURN_POLICY_BEFORE,
  NAV_MENU_RETURN_POLICY,
  NAV_MENU_RETURN_POLICY_AFTER,
} from '@shopgate/engage/market';
import { RETURN_POLICY_PATH } from '@shopgate/engage/page/constants';
import ReturnPolicy from './index';

let mockedShow;
jest.mock('@shopgate/engage/market', () => ({
  ...jest.requireActual('@shopgate/engage/market'),
  get showReturnPolicy() { return mockedShow; },
}));
jest.mock('@shopgate/engage/components', () => ({
  I18n: { Text: ({ string }) => string },
  Link: ({ children, href, role }) => <a href={href} role={role}>{children}</a>,
  Portal: jest.fn(({ children }) => children || null),
}));

const getPortalNames = () => Portal.mock.calls.map(([props]) => props.name);

describe('<ReturnPolicy />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render as expected when the return policy is supposed to be shown', () => {
    mockedShow = true;
    render(<ReturnPolicy />);

    expect(screen.getByRole('button', { name: 'navigation.return_policy' }))
      .toHaveAttribute('href', RETURN_POLICY_PATH);
    expect(getPortalNames()).toEqual([
      NAV_MENU_RETURN_POLICY_BEFORE,
      NAV_MENU_RETURN_POLICY,
      NAV_MENU_RETURN_POLICY_AFTER,
    ]);
  });

  it('should render as expected when the return policy is not supposed to be shown', () => {
    mockedShow = false;
    const { container } = render(<ReturnPolicy />);

    expect(container).toBeEmptyDOMElement();
    expect(getPortalNames()).toEqual([
      NAV_MENU_RETURN_POLICY_BEFORE,
      NAV_MENU_RETURN_POLICY_AFTER,
    ]);
  });
});
/* eslint-enable react/prop-types */
