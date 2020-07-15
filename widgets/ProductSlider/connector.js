import { connect } from 'react-redux';
import fetchProductsByQuery from '@shopgate/pwa-common-commerce/product/actions/fetchProductsByQuery';
import { getProductsResult } from '../selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component properties.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => {
  const { products, hash } = getProductsResult(state, props.settings.queryType, {
    sort: props.settings.sortOrder,
    value: props.settings.queryParams,
  }, props.id);

  return {
    products,
    hash,
  };
};
/**
 * Maps the contents of the state to the component props.
 * @param  {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  getProducts: (type, value, sort, id) => dispatch(fetchProductsByQuery(type, value, sort, id)),
});

/**
 * Check to see if the component props have even changed.
 * @param {*} next The next state.
 * @param {*} prev the previous state.
 * @returns {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (!prev.settings && next.settings) {
    return false;
  }

  if (prev.products.length !== next.products.length) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, mapDispatchToProps, null, { areStatePropsEqual });
