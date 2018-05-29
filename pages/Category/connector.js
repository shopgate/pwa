import { connect } from 'react-redux';
import {
  getCategoryProductCount,
  getCurrentCategories,
  getCurrentCategory,
  // GetCurrentCategoryId,
} from '@shopgate/pwa-common-commerce/category/selectors';
// Import { getProductsResult } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { getCurrentTitle } from '@shopgate/pwa-common/selectors/view';
// Import { isFilterBarShown } from './selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  categories: getCurrentCategories(state),
  category: getCurrentCategory(state),
  hasProducts: getCategoryProductCount(state),
  title: getCurrentTitle(state),
});

/**
 * Check to see if the categories have arrived.
 * @param {*} next The next state.
 * @param {*} prev the previous state.
 * @returns {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (!prev.category && next.category) return false;
  if (!prev.categories && next.categories) return false;
  if (prev.hasProducts !== next.hasProducts) return false;
  return true;
};

export default connect(mapStateToProps, null, null, { areStatePropsEqual });
