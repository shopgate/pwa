import { createSelector } from 'reselect';
import { getFavorites } from '@shopgate/pwa-common-commerce/favorites/selectors';
import { formatProductData } from '../helpers';

/**
 * Selects the favorites information.
 * @param {Object} state The current state.
 * @returns {Object} The favorites information.
 */
export default createSelector(
  getFavorites,
  favorites => favorites.map(product => formatProductData(product))
);
