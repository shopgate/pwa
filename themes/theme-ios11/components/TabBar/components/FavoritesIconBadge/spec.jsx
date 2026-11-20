import { render, screen } from '@testing-library/react';
import FavoritesIconBadge from './index';

/**
 * Renders the badge with the props of a shop that shows the badge and its number.
 * @param {Object} props Props that replace the defaults.
 * @returns {JSX.Element}
 */
const renderBadge = props => (
  <FavoritesIconBadge
    favoritesCount={0}
    showWishlistItemsCountBadge
    showCounter
    {...props}
  />
);

describe('FavoritesIconBadge', () => {
  it('should render only icon when badge is 0', () => {
    const { container } = render(renderBadge({ favoritesCount: 0 }));
    expect(container).toBeEmptyDOMElement();
  });
  it('should render exact number', () => {
    render(renderBadge({ favoritesCount: 1 }));
    expect(screen.getByText('1')).toHaveClass('theme__tab-bar__favorites-icon-badge');
  });
  it('should render nothing when the shop hides the badge', () => {
    const { container } = render(renderBadge({
      favoritesCount: 1,
      showWishlistItemsCountBadge: false,
    }));
    expect(container).toBeEmptyDOMElement();
  });
  it('should render an empty bubble when the counter is turned off', () => {
    const { container } = render(renderBadge({
      favoritesCount: 1,
      showCounter: false,
    }));
    expect(container.querySelector('.theme__tab-bar__favorites-icon-badge')).toBeInTheDocument();
    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });
});

describe('FavoritesIconBadge - behavior', () => {
  it('should show count when number is changed', () => {
    render(renderBadge({ favoritesCount: 99 }));
    expect(screen.getByText('99')).toHaveClass('theme__tab-bar__favorites-icon-badge');
  });

  it('should cap display at MAX when number exceeds maximum', () => {
    render(renderBadge({ favoritesCount: 9999 }));
    expect(screen.getByText('999+')).toHaveClass('theme__tab-bar__favorites-icon-badge');
  });

  it('should remain 999+ when count stays above max', () => {
    const { rerender } = render(renderBadge({ favoritesCount: 5000 }));
    expect(screen.getByText('999+')).toBeInTheDocument();
    rerender(renderBadge({ favoritesCount: 6000 }));
    expect(screen.getByText('999+')).toBeInTheDocument();
  });

  it('should show lower count when number goes back to limits', () => {
    const { rerender } = render(renderBadge({ favoritesCount: 9999 }));
    rerender(renderBadge({ favoritesCount: 100 }));
    expect(screen.getByText('100')).toBeInTheDocument();
  });
});
