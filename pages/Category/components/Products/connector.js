import { connect } from 'react-redux';
import { getCategoryProductCount } from '@shopgate/pwa-common-commerce/category/selectors';
import fetchCategoryProducts from '@shopgate/pwa-common-commerce/category/actions/fetchCategoryProducts';
import { getProductsResult } from '@shopgate/pwa-common-commerce/product/selectors/product';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  isVisible: getCategoryProductCount(state) > 0,
  viewMode: state.ui.categoryPage.viewMode,
  ...getProductsResult(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  getCategoryProducts(offset) {
    dispatch(fetchCategoryProducts(offset));
  },
});

export default connect(mapStateToProps, mapDispatchToProps);
