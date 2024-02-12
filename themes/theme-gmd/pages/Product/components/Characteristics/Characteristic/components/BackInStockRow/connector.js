import { connect } from 'react-redux';
import {
  getIsBackInStockEnabled,
  getSubscriptionByCharacteristics,
} from '@shopgate/engage/back-in-stock';
import {
  getProductVariants,
  getVariantAvailabilityByCharacteristics,
} from '@shopgate/pwa-common-commerce/product';
import { addBackInStockSubscription } from '@shopgate/engage/back-in-stock/actions';

/**
 * @return {Object} The extended component props.
 */
const makeMapStateToProps = () => (state, props) => ({
  subscription: getSubscriptionByCharacteristics(state, props),
  availability: getVariantAvailabilityByCharacteristics(state, props),
  productVariants: getProductVariants(state, props),
  isBackInStockEnabled: getIsBackInStockEnabled(state, props),
});

const mapDispatchToProps = {
  addBackInStockSubscription,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
