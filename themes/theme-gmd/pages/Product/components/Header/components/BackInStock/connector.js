import { connect } from 'react-redux';
import {
  getIsProductOnBackInStockListByVariant,
} from '@shopgate/engage/back-in-stock/selectors/backInStock';
import {
  getProductAvailability,
  getProductType,
} from '@shopgate/pwa-common-commerce/product';
import { addBackInStoreSubscription } from '@shopgate/engage/back-in-stock/actions';

/**
 * @return {Object} The extended component props.
 */
const makeMapStateToProps = () => (state, props) => ({
  isOnBackInStockList: getIsProductOnBackInStockListByVariant(state, props),
  productType: getProductType(state, props),
  stock: getProductAvailability(state, props),
});

const mapDispatchToProps = {
  addBackInStoreSubscription,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
