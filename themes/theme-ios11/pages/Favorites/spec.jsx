/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import {
  getFavoritesCount,
  isInitialLoading,
  getHasMultipleFavoritesListsSupport,
} from '@shopgate/pwa-common-commerce/favorites/selectors';
import Favorites from './index';
import { FAVORITES_SHOW_TOAST_DELAY } from './constants';

jest.mock('@shopgate/pwa-common-commerce/favorites/selectors', () => ({
  getFavoritesCount: jest.fn(),
  isInitialLoading: jest.fn(),
  getHasMultipleFavoritesListsSupport: jest.fn(),
}));
jest.mock('@shopgate/engage/components', () => ({
  View: ({ children }) => children,
}));
jest.mock('@shopgate/pwa-ui-shared/LoadingIndicator', () => () => <div>LoadingIndicator</div>);
jest.mock('Components/AppBar/presets', () => ({
  BackBar: ({ title }) => <h1>{title}</h1>,
}));
jest.mock('./components/EmptyFavorites', () => () => <div>EmptyFavorites</div>);
jest.mock('./components/FavoritesList', () => () => <div>FavoritesList</div>);

const state = {};

/**
 * @returns {Object} The render result.
 */
const renderComponent = () => render((
  <Provider store={createStore(() => state)}>
    <Favorites />
  </Provider>
));

describe('<Favorites> page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getFavoritesCount.mockReturnValue(0);
    isInitialLoading.mockReturnValue(false);
    getHasMultipleFavoritesListsSupport.mockReturnValue(false);
  });

  describe('Initial page', () => {
    it('should render an initial page with loading indicator', () => {
      isInitialLoading.mockReturnValue(true);
      getFavoritesCount.mockReturnValue(1);

      renderComponent();

      expect(screen.getByRole('heading', { name: 'titles.favorites' })).toBeInTheDocument();
      expect(screen.getByText('LoadingIndicator')).toBeInTheDocument();
      expect(screen.queryByText('EmptyFavorites')).not.toBeInTheDocument();
      expect(screen.queryByText('FavoritesList')).not.toBeInTheDocument();
      expect(isInitialLoading).toHaveBeenCalledWith(state);
    });
  });

  describe('Empty page', () => {
    it('should render an empty page', () => {
      renderComponent();

      expect(screen.getByRole('heading', { name: 'titles.favorites' })).toBeInTheDocument();
      expect(screen.getByText('EmptyFavorites')).toBeInTheDocument();
      expect(screen.queryByText('LoadingIndicator')).not.toBeInTheDocument();
      expect(screen.queryByText('FavoritesList')).not.toBeInTheDocument();
    });
  });

  describe('Page with items', () => {
    it('should render a page with products', () => {
      getFavoritesCount.mockReturnValue(1);

      renderComponent();

      expect(screen.getByRole('heading', { name: 'titles.favorites' })).toBeInTheDocument();
      expect(screen.getByText('FavoritesList')).toBeInTheDocument();
      expect(screen.queryByText('LoadingIndicator')).not.toBeInTheDocument();
      expect(screen.queryByText('EmptyFavorites')).not.toBeInTheDocument();
      expect(getFavoritesCount).toHaveBeenCalledWith(state);
    });

    it('should render the lists without products when multiple lists are supported', () => {
      getHasMultipleFavoritesListsSupport.mockReturnValue(true);

      renderComponent();

      expect(screen.getByText('FavoritesList')).toBeInTheDocument();
      expect(screen.queryByText('EmptyFavorites')).not.toBeInTheDocument();
      expect(getHasMultipleFavoritesListsSupport).toHaveBeenCalledWith(state);
    });
  });

  describe('Constants', () => {
    it('should export FAVORITES_SHOW_TOAST_DELAY', () => {
      expect(typeof FAVORITES_SHOW_TOAST_DELAY).toBe('number');
    });
  });
});
/* eslint-enable react/prop-types */
