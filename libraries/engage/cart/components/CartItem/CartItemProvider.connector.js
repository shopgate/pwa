import { connect } from 'react-redux';
import { hasLineItemPromotions } from '@shopgate/engage/cart';
import { makeGetEnabledFulfillmentMethodsCount } from '@shopgate/engage/core/config';
import { makeGetLocation } from '@shopgate/engage/locations';

/**
 * @return {Function} The extended component props.
 */
const makeMapStateToProps = () => {
  const getEnabledFulfillmentMethods = makeGetEnabledFulfillmentMethodsCount();
  const getLocation = makeGetLocation((state, props) => props.locationId);

  return (state, props) => {
    const { isOrderDetails, isCheckoutConfirmation } = props;
    const isCart = !isOrderDetails && !isCheckoutConfirmation;
    return {
      location: getLocation(state, props),
      enabledFulfillmentMethodsCount: getEnabledFulfillmentMethods(state),
      cartHasLineItemPromotions: isCart && hasLineItemPromotions(state),
    };
  };
};

export default connect(makeMapStateToProps);
