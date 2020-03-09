import { connect } from 'react-redux';
import {
  hasProductVariants,
  isProductOrderable,
} from '@shopgate/pwa-common-commerce/product/selectors/product';
import { isProductPageLoading } from '@shopgate/pwa-common-commerce/product/selectors/page';
import {
  makeGetUserLocation,
  makeIsFulfillmentSelectorDisabled,
  makeIsRopeProductOrderable,
} from '@shopgate/engage/locations';
import { addProductToCart as addToCart } from './actions';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  const getUserLocation = makeGetUserLocation();
  const isFulfillmentSelectorDisabled = makeIsFulfillmentSelectorDisabled();
  const isRopeProductOrderable = makeIsRopeProductOrderable(true);

  /**
   * @param {Object} state The current application state.
   * @param {Object} props The component props.
   * @return {Object} The extended component props.
   */
  return (state, props) => ({
    /**
     * 1. Product has no variants and not orderable
     * 2. Parent product can be not orderable but having orderable variants
     * 3. A ROPE fulfillment method is selected and the product is orderable at the location
     */
    disabled: (!isProductOrderable(state, props) && !hasProductVariants(state, props)) &&
      isRopeProductOrderable(state, props) === false,
    loading: isProductPageLoading(state, props),
    userLocation: getUserLocation(state),
    hasFulfillmentMethods: !isFulfillmentSelectorDisabled(state, props),
  });
}

/**
 * @param {Function} dispatch The redux dispatch function.
 * @param {Function} props The component props.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = {
  addToCart,
};

/**
 * @param {Object} next The next component props.
 * @param {Object} prev The previous component props.
 * @return {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (prev.disabled !== next.disabled) {
    return false;
  }

  if (prev.loading !== next.loading) {
    return false;
  }

  if (prev.hasFulfillmentMethods !== next.hasFulfillmentMethods) {
    return false;
  }

  if (prev.userLocation !== next.userLocation) {
    return false;
  }

  return true;
};

export default connect(makeMapStateToProps, mapDispatchToProps, null, { areStatePropsEqual });
