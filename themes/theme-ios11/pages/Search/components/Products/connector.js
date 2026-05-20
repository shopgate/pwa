import { connect } from 'react-redux';
import { buildFetchSearchResultsParams } from '@shopgate/engage/product';
import isEqual from 'lodash/isEqual';
import { getProductsResult } from '@shopgate/pwa-common-commerce/product/selectors/product';
import getProducts from './actions/getProducts';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  ...getProductsResult(state, {
    ...props,
    params: buildFetchSearchResultsParams().params,
  }),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  getProducts: (categoryId, sort, offset) => dispatch(getProducts(categoryId, sort, offset)),
});
/**
 * Custom stateProps equality: must include `hash` (and related fields) from `getProductsResult`.
 * Otherwise a new search can keep the same empty `products` / `totalProductCount` while `hash`
 * changes, and react-redux would skip updates — leaving InfiniteContainer’s loading state stuck.
 * @param {*} next Next state props from connect.
 * @param {*} prev Previous state props.
 * @returns {boolean} True if props are equal (skip re-render).
 */
const areStatePropsEqual = (next, prev) => {
  if (prev.hash !== next.hash) {
    return false;
  }
  if (prev.expired !== next.expired) {
    return false;
  }
  if (prev.sort !== next.sort) {
    return false;
  }
  if (prev.totalProductCount !== next.totalProductCount) {
    return false;
  }
  if (!isEqual(prev.products, next.products)) {
    return false;
  }
  if (prev.isFetching !== next.isFetching) {
    return false;
  }
  return true;
};

export default connect(mapStateToProps, mapDispatchToProps, null, { areStatePropsEqual });
