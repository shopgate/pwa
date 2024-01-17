import { connect } from 'react-redux';
import {
  getIsBackInStockEnabled,
  getSubscriptionByCharacteristics,
} from '@shopgate/engage/back-in-stock/selectors/backInStock';
import {
  getProductVariants,
  getVariantAvailabilityByCharacteristics,
} from '@shopgate/pwa-common-commerce/product';
import { addBackInStoreSubscription } from '@shopgate/engage/back-in-stock/actions';
import grantPushPermissions from '@shopgate/engage/core/actions/grantPushPermissions';

/**
 * @return {Object} The extended component props.
 */
const makeMapStateToProps = () => (state, props) => ({
  availability: getVariantAvailabilityByCharacteristics(state, props),
  subscription: getSubscriptionByCharacteristics(state, props),
  productVariants: getProductVariants(state, props),
  isBackinStockEnabled: getIsBackInStockEnabled(state, props),
});

const mapDispatchToProps = {
  addBackInStoreSubscription,
  grantPushPermissions,

};

export default connect(makeMapStateToProps, mapDispatchToProps);
