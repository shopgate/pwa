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

/**
 * @return {Object} The extended component props.
 */
const makeMapStateToProps = () => (state, props) => ({
  subscription: getSubscriptionByCharacteristics(state, props),
  availability: getVariantAvailabilityByCharacteristics(state, props),
  productVariants: getProductVariants(state, props),
  isBackinStockEnabled: getIsBackInStockEnabled(state, props),
});

const mapDispatchToProps = {
  addBackInStoreSubscription,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
