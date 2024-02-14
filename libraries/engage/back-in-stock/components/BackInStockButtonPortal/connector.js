import { connect } from 'react-redux';
import {
  getIsBackInStockEnabled,
  getSubscriptionByVariant,
} from '@shopgate/engage/back-in-stock';
import { addBackInStockSubscription } from '@shopgate/engage/back-in-stock/actions';
import {
  getProductAvailability,
  makeGetProductType,
} from '@shopgate/engage/product';
import { grantPushPermissions } from '@shopgate/engage/core';

/**
 * @return {Object} The extended component props.
 */
const makeMapStateToProps = () => {
  const getProductType = makeGetProductType();
  return (state, props) => ({
    subscription: getSubscriptionByVariant(state, props),
    productType: getProductType(state, props),
    stock: getProductAvailability(state, props),
    isBackInStockEnabled: getIsBackInStockEnabled(state, props),
  });
};

const mapDispatchToProps = {
  addBackInStockSubscription,
  grantPushPermissions,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
