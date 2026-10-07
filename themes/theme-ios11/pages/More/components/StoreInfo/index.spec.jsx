/* eslint-disable react/prop-types */
import { render, screen, within } from '@testing-library/react';
import {
  NAV_MENU_STORE_INFORMATION_BEFORE,
  NAV_MENU_STORE_INFORMATION,
  NAV_MENU_STORE_INFORMATION_AFTER,
} from '@shopgate/engage/core/constants';
import StoreInfo from './index';

jest.mock('@shopgate/pwa-common-commerce/market/helpers/showReturnPolicy', () => true);
jest.mock('@shopgate/pwa-common/components/Portal', () => function Portal({ name, children }) {
  return <div data-portal={name}>{children}</div>;
});
jest.mock('@shopgate/engage/components', () => ({
  I18n: { Text: ({ string }) => string },
  Link: ({ children, href, role }) => <a href={href} role={role}>{children}</a>,
  Portal: ({ name, children }) => <div data-portal={name}>{children}</div>,
  Typography: ({ children, component: Component }) => <Component>{children}</Component>,
}));

describe('<StoreInfo />', () => {
  it('should render as expected', () => {
    const { container } = render(<StoreInfo />);

    expect(Array.from(container.children).map(child => child.getAttribute('data-portal'))).toEqual([
      NAV_MENU_STORE_INFORMATION_BEFORE,
      NAV_MENU_STORE_INFORMATION,
      NAV_MENU_STORE_INFORMATION_AFTER,
    ]);
    expect(screen.getByRole('heading', {
      level: 2,
      name: 'navigation.store_information',
    })).toBeInTheDocument();

    ['shipping', 'payment', 'terms', 'privacy', 'return-policy', 'imprint'].forEach((name) => {
      const portals = [
        `nav-menu.${name}.before`,
        `nav-menu.${name}`,
        `nav-menu.${name}.after`,
      ].map(portal => container.querySelector(`[data-portal="${portal}"]`));

      portals.forEach((portal) => {
        expect(portal).toBeInTheDocument();
      });
      expect(within(portals[1]).getByRole('button')).toBeInTheDocument();
    });
  });
});
/* eslint-enable react/prop-types */
