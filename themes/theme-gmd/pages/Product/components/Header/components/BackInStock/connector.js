import { connect } from 'react-redux';
import {
  getIsBackInStockEnabled,
  getIsProductOnBackInStockListByVariant,
} from '@shopgate/engage/back-in-stock/selectors/backInStock';
import {
  getProductAvailability,
  getProductType,
} from '@shopgate/pwa-common-commerce/product';
import { addBackInStoreSubscription } from '@shopgate/engage/back-in-stock/actions';
import grantPushPermissions from '@shopgate/engage/core/actions/grantPushPermissions';
/**
 * @return {Object} The extended component props.
 */
const makeMapStateToProps = () => (state, props) => ({
  isOnBackInStockList: getIsProductOnBackInStockListByVariant(state, props),
  productType: getProductType(state, props),
  stock: getProductAvailability(state, props),
  isBackinStockEnabled: getIsBackInStockEnabled(state, props),
});

const mapDispatchToProps = {
  addBackInStoreSubscription,
  grantPushPermissions,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
