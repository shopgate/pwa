import { connect } from 'react-redux';
import {
  getIsBackInStockEnabled,
  getSubscriptionByVariant,
} from '@shopgate/engage/back-in-stock/selectors/backInStock';
import {
  getProductAvailability,
  getProductType,
} from '@shopgate/pwa-common-commerce/product';
import { addBackInStockSubscription } from '@shopgate/engage/back-in-stock/actions';
import grantPushPermissions from '@shopgate/engage/core/actions/grantPushPermissions';

/**
 * @return {Object} The extended component props.
 */
const makeMapStateToProps = () => (state, props) => ({
  subscription: getSubscriptionByVariant(state, props),
  productType: getProductType(state, props),
  stock: getProductAvailability(state, props),
  isBackinStockEnabled: getIsBackInStockEnabled(state, props),
});

const mapDispatchToProps = {
  addBackInStockSubscription,
  grantPushPermissions,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
