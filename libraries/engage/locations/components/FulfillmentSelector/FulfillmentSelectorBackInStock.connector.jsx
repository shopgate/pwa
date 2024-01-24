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
const makeMapStateToProps = (_, props) => {
  const getIsOnBackInStockList =
    makeGetIsProductOnBackInStockList({ productCode: props.productId });
  return (state, innerProps) => ({
    isOnBackInStockList: getIsOnBackInStockList(state),
    product: getProduct(state, innerProps),
    productType: getProductType(state, innerProps),
  });
};

const mapDispatchToProps = {
  addBackInStoreSubscription,
};

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
);
