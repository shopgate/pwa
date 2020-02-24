// @flow
import { connect } from 'react-redux';
import { getProduct } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { makeGetProductLocations, makeGetIsFetchingProductLocations } from '../../selectors';
import { type OwnProps, type StateProps } from './ProductLocations.types';

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

export default connect<StateProps, any, OwnProps>(makeMapStateToProps);
