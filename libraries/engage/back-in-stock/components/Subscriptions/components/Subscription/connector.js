import { connect } from 'react-redux';
import { addBackInStockSubscription } from '@shopgate/engage/back-in-stock/actions';
import { getSubscriptionByVariant } from '@shopgate/engage/back-in-stock/selectors/backInStock';

/**
 * @return {Object} The extended component props.
 */
const makeMapStateToProps = () => (state, props) => ({
  subscription: getSubscriptionByVariant(state, props),
});

const mapDispatchToProps = {
  addBackInStockSubscription,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
