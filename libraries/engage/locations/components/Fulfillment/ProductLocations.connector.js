import { connect } from 'react-redux';
import { getProduct } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { makeGetProductLocations, makeGetIsFetchingProductLocations } from '../../selectors';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  const getProductLocations = makeGetProductLocations();
  const getIsFetchingProductLocations = makeGetIsFetchingProductLocations();

  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {Object}
   */
  return (state, props) => ({
    product: getProduct(state, props),
    locations: getProductLocations(state, props),
    loading: getIsFetchingProductLocations(state, props),
  });
}

export default connect(makeMapStateToProps);
