import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { getFavoritesCount } from '@shopgate/pwa-common-commerce/favorites/selectors';
import {
  mockedState,
  mockedEmptyState,
} from 'Pages/Favorites/mock';
import ConnectedBadge, { FavoritesIconBadge } from './index';

jest.mock('@shopgate/pwa-common-commerce/favorites/selectors', () => ({
  getFavoritesCount: jest.fn(() => 1),
}));

jest.mock('../../hooks', () => ({
  useShowFavoritesCounter: jest.fn(() => true),
}));

const mockedStore = configureStore();
/**
 * Renders the connected component
 * @param {boolean} state State that would be used for store.
 * @return {Object}
 */
const renderComponent = state => render((
  <Provider store={mockedStore(state)}>
    <ConnectedBadge />
  </Provider>
));

describe('TabBar favorites action', () => {
  it('should render only icon when badge is 0', () => {
    getFavoritesCount.mockReturnValueOnce(0);
    const { container } = renderComponent(mockedEmptyState);
    expect(container).toBeEmptyDOMElement();
  });
  it('should render exact number', () => {
    renderComponent(mockedState);
    expect(screen.getByText('1')).toHaveClass('theme__tab-bar__favorites-icon-badge');
  });
});

describe('TabBar favorites action - behavior', () => {
  it('should render empty when unconnected count is 0', () => {
    const { container } = render(<FavoritesIconBadge favoritesCount={0} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should show count when number is changed', () => {
    render(<FavoritesIconBadge favoritesCount={99} />);
    expect(screen.getByText('99')).toHaveClass('theme__tab-bar__favorites-icon-badge');
  });

  it('should cap display at MAX when number exceeds maximum', () => {
    render(<FavoritesIconBadge favoritesCount={9999} />);
    expect(screen.getByText('999+')).toHaveClass('theme__tab-bar__favorites-icon-badge');
  });

  it('should remain 999+ when count stays above max', () => {
    const { rerender } = render(<FavoritesIconBadge favoritesCount={5000} />);
    expect(screen.getByText('999+')).toBeInTheDocument();
    rerender(<FavoritesIconBadge favoritesCount={6000} />);
    expect(screen.getByText('999+')).toBeInTheDocument();
  });

  it('should show lower count when number goes back to limits', () => {
    const { rerender } = render(<FavoritesIconBadge favoritesCount={9999} />);
    rerender(<FavoritesIconBadge favoritesCount={100} />);
    expect(screen.getByText('100')).toBeInTheDocument();
  });
});
