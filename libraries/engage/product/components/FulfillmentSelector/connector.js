import { connect } from 'react-redux';
import { makeGetUserLocationState } from '@shopgate/pwa-common/selectors/user';
import { getProduct } from '@shopgate/pwa-common-commerce/product';

/**
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const makeMapStateToProps = () => {
  const getUserLocation = makeGetUserLocationState();

  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {Object}
   */
  return (state, props) => {
    // Get the fulfillment methods of the currently selected product
    const product = getProduct(state, {
      ...props,
      productId: props.productCode,
    }) || {};
    const { fulfillmentMethods = null } = product;

    return {
      fulfillmentMethods,
      location: getUserLocation(state),
    };
  };
};

/**
 * @param {Object} next The next component props.
 * @param {Object} prev The previous component props.
 * @return {boolean}
 */
const areStatePropsEqual = (next, prev) => (prev.location && next.location
  && prev.location.code === next.location.code
  && prev.location.name === next.location.name
  && prev.location.visibleInventory === next.location.visibleInventory
  && prev.fulfillmentMethods === next.fulfillmentMethods);

export default connect(makeMapStateToProps, null, null, { areStatePropsEqual });
