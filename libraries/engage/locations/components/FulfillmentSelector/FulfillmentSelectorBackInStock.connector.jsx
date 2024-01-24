import { connect } from 'react-redux';
import { addBackInStoreSubscription } from '@shopgate/engage/back-in-stock/actions';
import { makeGetIsProductOnBackInStockList } from '@shopgate/engage/back-in-stock/selectors/backInStock';
import { getProductType } from '@shopgate/pwa-common-commerce/product';
import { getProduct } from '@shopgate/engage/product/selectors/product';

/**
 * @param {Object} _ The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const makeMapStateToProps = () => (state, props) => {
  // TODO Is this legal?
  const getIsOnBackInStockList =
      makeGetIsProductOnBackInStockList({ productCode: props.productId });
  return ({
    isOnBackInStockList: getIsOnBackInStockList(state),
    product: getProduct(state, props),
    productType: getProductType(state, props),
  });
};

const mapDispatchToProps = {
  addBackInStoreSubscription,
};

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
);
