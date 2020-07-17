import { connect } from 'react-redux';
import { isProductPageLoading } from '@shopgate/pwa-common-commerce/product/selectors/page';
import {
  getPreferredLocation,
  makeIsFulfillmentSelectorMethodEnabled,
  getPreferredFulfillmentMethod,
} from '@shopgate/engage/locations';
import { makeIsAddToCartButtonDisabled } from '@shopgate/engage/cart';
import { addProductToCart as addToCart } from './actions';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  const isAddToCartButtonDisabled = makeIsAddToCartButtonDisabled();

  /**
   * @param {Object} state The current application state.
   * @param {Object} props The component props.
   * @return {Object} The extended component props.
   */
  return (state, props) => {
    const userLocationFulfillmentMethod = getPreferredFulfillmentMethod(state, props);

    let isUserFulfillmentMethodAllowed = false;

    if (userLocationFulfillmentMethod) {
      isUserFulfillmentMethodAllowed = makeIsFulfillmentSelectorMethodEnabled(
        (istate, iprops) => getPreferredLocation(istate, iprops)?.code,
        (_, iprops) => iprops.variantId || iprops.productId || null,
        userLocationFulfillmentMethod
      )(state, props);
    }

    return {
      disabled: isAddToCartButtonDisabled(state, props),
      loading: isProductPageLoading(state, props),
      userLocation: getPreferredLocation(state, props),
      userMethod: userLocationFulfillmentMethod,
      isRopeFulfillmentMethodAllowed: isUserFulfillmentMethodAllowed,
    };
  };
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

  if (prev.isRopeFulfillmentMethodAllowed !== next.isRopeFulfillmentMethodAllowed) {
    return false;
  }

  if (prev.userLocation !== next.userLocation) {
    return false;
  }

  return true;
};

export default connect(makeMapStateToProps, mapDispatchToProps, null, { areStatePropsEqual });
