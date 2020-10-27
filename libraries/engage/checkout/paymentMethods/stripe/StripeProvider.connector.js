import { connect } from 'react-redux';
import {
  getStripePublishableKey,
} from '@shopgate/engage/checkout/selectors/payment';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  /**
   * @param {Object} state The application state.
   * @returns {Object}
   */
  return state => ({
    publishableKey: getStripePublishableKey(state),
  });
}

export default connect(makeMapStateToProps);
