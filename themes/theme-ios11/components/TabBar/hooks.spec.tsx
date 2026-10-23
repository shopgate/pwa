import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { FooterBarVariant } from '@shopgate/engage/settings/types/appSettings';
import { useFooterBarLayout } from './hooks';

let mockTabBarVariant = 'fixed';

jest.mock('react-redux', () => ({ useSelector: (selector: () => unknown) => selector() }));
jest.mock('@shopgate/engage/settings/selectors/appSettings', () => ({
  getAreAppSettingsHydrated: () => true,
  getTabBarSettings: () => ({
    variant: mockTabBarVariant,
    transition: 'fade',
    hideOnScroll: false,
    showLabels: true,
    fixed: { borderEnabled: true },
  }),
}));
jest.mock('@shopgate/engage/core/hooks', () => ({
  useWidgetSettings: () => ({}),
  useScrollDirectionChange: jest.fn(),
}));
jest.mock('@shopgate/engage', () => ({ themeConfig: { variables: {} } }));

/**
 * Renders the resolved layout as text.
 * @param props The component props.
 * @param props.variant The configured variant of the bar.
 * @returns The layout.
 */
const Layout = ({ variant }: { variant: FooterBarVariant }) => {
  const layout = useFooterBarLayout(variant);
  return <span>{`${layout.variant} ${layout.gap}`}</span>;
};

describe('useFooterBarLayout()', () => {
  it('keeps the configured variant above a fixed tab bar', () => {
    mockTabBarVariant = 'fixed';
    const { rerender } = render(<Layout variant="fixed" />);
    expect(screen.getByText('fixed 16')).toBeInTheDocument();

    rerender(<Layout variant="floating" />);
    expect(screen.getByText('floating 16')).toBeInTheDocument();
  });

  it('makes the bar float above a floating tab bar', () => {
    mockTabBarVariant = 'floating';
    render(<Layout variant="fixed" />);

    expect(screen.getByText('floating 8')).toBeInTheDocument();
  });
});
