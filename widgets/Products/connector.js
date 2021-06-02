import { connect } from 'react-redux';
import fetchProductsByQuery from '@shopgate/pwa-common-commerce/product/actions/fetchProductsByQuery';
import {
  getProductsResult,
  getProductsFetchingState,
} from '../selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component properties.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => {
  const params = [
    state,
    props.settings.queryType,
    {
      sort: props.settings.sortOrder,
      value: props.settings.queryParams,
    },
    props.id,
  ];

  return {
    ...getProductsResult(...params),
    isFetching: getProductsFetchingState(...params),
  };
};

/**
 * Maps the contents of the state to the component props.
 * @param  {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  getProducts: (type, value, options, id) => (
    dispatch(fetchProductsByQuery(type, value, options, id))
  ),
});

/**
 * Check to see if the component props have even changed.
 * @param {*} next The next state.
 * @param {*} prev the previous state.
 * @returns {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (prev.products.length !== next.products.length) return false;
  if (prev.totalProductCount !== next.totalProductCount) return false;
  if (prev.isFetching !== next.isFetching) return false;
  return true;
};

export default connect(mapStateToProps, mapDispatchToProps, null, { areStatePropsEqual });
