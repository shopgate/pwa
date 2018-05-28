import { connect } from 'react-redux';
import {
  // GetCategoryProductCount,
  // GetCurrentCategories,
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
  category: getCurrentCategory(state),
  title: getCurrentTitle(state),
});

export default connect(mapStateToProps);
