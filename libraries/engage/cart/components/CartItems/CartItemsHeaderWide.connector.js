import { connect } from 'react-redux';
import { hasLineItemPromotions } from '@shopgate/engage/cart';
import { makeGetEnabledFulfillmentMethodsCount } from '@shopgate/engage/core/config';

/**
 * @return {Function} The extended component props.
 */
const makeMapStateToProps = () => {
  const getEnabledFulfillmentMethodsCount = makeGetEnabledFulfillmentMethodsCount();

  return (state, { isOrderDetails, isCheckoutConfirmation }) => {
    const isCart = !isOrderDetails && !isCheckoutConfirmation;
    return {
      enabledFulfillmentMethodsCount: getEnabledFulfillmentMethodsCount(state),
      hasLineItemPromotions: isCart && hasLineItemPromotions(state),
    };
  };
};

export default connect(makeMapStateToProps);
