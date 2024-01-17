import { connect } from 'react-redux';
import {
  getBackInStockSubscriptions,
  getBackInStockSubscriptionsFetching, getBackInStockSubscriptionsInitial,
} from '../selectors/backInStock';
import {
  addBackInStoreSubscription,
  removeBackInStoreSubscription,
} from '../actions';

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
  });
}

const mapDispatchToProps = {
  addBackInStoreSubscription,
  removeBackInStoreSubscription,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
