import { connect } from 'react-redux';
import { getBackInStockSubscriptions } from '../selectors/backInStock';
import { addBackInStoreSubscription } from '../actions';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props
   * @returns {Object}
   */
  return (state, props) => ({
    subscriptions: getBackInStockSubscriptions(state, props),
  });
}

const mapDispatchToProps = {
  addBackInStoreSubscription,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
