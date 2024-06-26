import { connect } from 'react-redux';
import {
  getBackInStockSubscriptions,
  getBackInStockSubscriptionsFetching,
  getBackInStockSubscriptionsInitial,
  getAreBackInStockRequestsPossible,
} from '@shopgate/engage/back-in-stock/selectors';
import {
  addBackInStockSubscription,
  removeBackInStockSubscription,
} from '@shopgate/engage/back-in-stock/actions';

/**
 * @return {Function} The extended component props.
 */
function makeMapStateToProps() {
  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props
   * @returns {Object}
   */
  return (state, props) => ({
    subscriptions: getBackInStockSubscriptions(state, props),
    isFetching: getBackInStockSubscriptionsFetching(state, props),
    isInitial: getBackInStockSubscriptionsInitial(state, props),
    requestsPossible: getAreBackInStockRequestsPossible(state, props),
  });
}

const mapDispatchToProps = {
  addBackInStockSubscription,
  removeBackInStockSubscription,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
