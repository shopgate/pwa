import { connect } from 'react-redux';
import {
  getIsProductOnBackInStockListByCharacteristics,
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
  availability: getVariantAvailabilityByCharacteristics(state, props),
  isOnBackInStockList: getIsProductOnBackInStockListByCharacteristics(state, props),
  productVariants: getProductVariants(state, props),
});

const mapDispatchToProps = {
  addBackInStoreSubscription,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
