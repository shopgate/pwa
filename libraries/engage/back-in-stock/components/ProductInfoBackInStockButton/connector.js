import { connect } from 'react-redux';
import {
  getIsBackInStockEnabled,
  makeGetSubscriptionByProduct,
} from '@shopgate/engage/back-in-stock/selectors';
import {
  getProduct,
} from '@shopgate/engage/product';

/**
 * @return {Object} The extended component props.
 */
const makeMapStateToProps = () => {
  const getSubscriptionByProduct = makeGetSubscriptionByProduct();
  return (state, props) => ({
    subscription: getSubscriptionByProduct(state, props),
    isBackInStockEnabled: getIsBackInStockEnabled(state, props),
    product: getProduct(state, props),
  });
};

export default connect(makeMapStateToProps);
