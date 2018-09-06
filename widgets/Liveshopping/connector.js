import { connect } from 'react-redux';
import getLiveshoppingProducts from '@shopgate/pwa-common-commerce/product/actions/getLiveshoppingProducts';
import { getProductsResult } from './selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  products: getProductsResult(state, props).products,
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  getLiveshoppingProducts: () => dispatch(getLiveshoppingProducts()),
});

/**
 * Check to see if the component props have even changed.
 * @param {*} next The next state.
 * @param {*} prev the previous state.
 * @returns {boolean}
 */
const areStatePropsEqual = (next, prev) => (
  next.products.length === prev.products.length
);

export default connect(mapStateToProps, mapDispatchToProps, null, { areStatePropsEqual });
