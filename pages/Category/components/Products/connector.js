import { connect } from 'react-redux';
import { buildFetchCategoryProductsParams } from '@shopgate/engage/product';
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
    ...{ params: buildFetchCategoryProductsParams().params },
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

export default connect(mapStateToProps, mapDispatchToProps);
