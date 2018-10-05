import { connect } from 'react-redux';
import getProductsByQuery from '@shopgate/pwa-common-commerce/product/actions/getProductsByQuery';
import { getProductsResult } from '../selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component properties.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  products: getProductsResult(state, props.settings.queryType, {
    sort: props.settings.sortOrder,
    value: props.settings.queryParams,
  }, props.id).products,
});

/**
 * Maps the contents of the state to the component props.
 * @param  {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  getProducts: (type, value, sort, id) =>
    dispatch(getProductsByQuery(type, value, sort, id)),
});

export default connect(mapStateToProps, mapDispatchToProps);
