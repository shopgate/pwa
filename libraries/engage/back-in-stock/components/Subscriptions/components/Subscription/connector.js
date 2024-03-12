import { connect } from 'react-redux';
import { addBackInStockSubscription } from '@shopgate/engage/back-in-stock/actions';
import { makeGetSubscriptionByProduct } from '@shopgate/engage/back-in-stock/selectors';

/**
 * @return {Object} The extended component props.
 */
const makeMapStateToProps = () => {
  const getSubscriptionByProduct = makeGetSubscriptionByProduct();
  return (state, props) => ({
    subscription: getSubscriptionByProduct(state, props),
  });
};

const mapDispatchToProps = {
  addBackInStockSubscription,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
