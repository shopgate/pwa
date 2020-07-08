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
  getProducts: (searchPhrase, sort, offset) => dispatch(getProducts(searchPhrase, sort, offset)),
});

/**
 * Check to see if the categories have arrived.
 * @param {*} next The next state.
 * @param {*} prev the previous state.
 * @returns {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (!isEqual(prev.products, next.products)) {
    return false;
  }

  if (prev.totalProductCount !== next.totalProductCount) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, mapDispatchToProps, null, { areStatePropsEqual });
