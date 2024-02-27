import { connect } from 'react-redux';
import {
  getIsBackInStockEnabled,
  makeGetSubscriptionByProduct,
} from '@shopgate/engage/back-in-stock';
import { addBackInStockSubscription } from '@shopgate/engage/back-in-stock/actions';
import {
  getProduct,
} from '@shopgate/engage/product';
import { grantPushPermissions } from '@shopgate/engage/core';

/**
 * @return {Object} The extended component props.
 */
const makeMapStateToProps = () => {
  const getSubscriptionByProduct = makeGetSubscriptionByProduct();
  return (state, props) => ({
    subscription: getSubscriptionByProduct(state, props),
    isBackInStockEnabled: getIsBackInStockEnabled(state, props),
    product: getProduct(state, props),
  });
};

const mapDispatchToProps = {
  addBackInStockSubscription,
  grantPushPermissions,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
