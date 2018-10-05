import connect from '@shopgate/pwa-common/components/Router/helpers/connect';
import getLiveshoppingProducts from '@shopgate/pwa-common-commerce/product/actions/getLiveshoppingProducts';
import { getProductsResult } from './selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  products: getProductsResult(state).products,
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  getLiveshoppingProducts: () => dispatch(getLiveshoppingProducts()),
});

export default connect(mapStateToProps, mapDispatchToProps);
