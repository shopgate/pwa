import { connect } from 'react-redux';
import {
  getIsBackInStockEnabled,
  makeGetSubscriptionByProduct,
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
  const getSubscriptionByProduct = makeGetSubscriptionByProduct();
  return (state, props) => ({
    subscription: getSubscriptionByProduct(state, props),
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
