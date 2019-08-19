import { createSelector } from 'reselect';
import { createPageviewData } from '../helpers';
import getPage, { makeGetRoutePageConfig } from './page';
import getCart from './cart';
import getSearch from './search';
import { makeGetRouteCategory } from './category';
import { makeGetRouteProduct } from './product';

/**
 * Creates a selector that retrieves tracking data for the current route.
 * @returns {Function}
 */
export const makeGetTrackingData = () => {
  const getRouteCategory = makeGetRouteCategory();
  const getRouteProduct = makeGetRouteProduct();
  const getRoutePageConfig = makeGetRoutePageConfig();

  /**
   * Selects the combined tracking information.
   * @param {Object} state The current state.
   * @returns {Object} The tracking data.
   */
  return createSelector(
    getPage,
    getCart,
    getSearch,
    getRouteCategory,
    getRouteProduct,
    getRoutePageConfig,
    (state, props = {}) => props.pattern,
    (page, cart, search, category, product, pageConfig, pattern) => createPageviewData({
      page,
      cart,
      search,
      category,
      product,
      pageConfig,
      pattern,
    })
  );
};
