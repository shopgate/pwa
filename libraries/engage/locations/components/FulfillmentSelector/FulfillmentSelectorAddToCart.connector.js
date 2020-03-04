import { connect } from 'react-redux';
import { makeGetFulfillmentPaths } from '@shopgate/engage/core/config';
import { makeGetUserLocationFulfillmentMethod } from '../../selectors';

/**
 * @return {Function}
 */
function makeMapStateToProps() {
  const getFulfillmentPaths = makeGetFulfillmentPaths();
  const getUserLocationFulfillmentMethod = makeGetUserLocationFulfillmentMethod();

  /**
   * @param {Object} state The application state.
   * @returns {Object}
   */
  return state => ({
    fulfillmentPaths: getFulfillmentPaths(state),
    userFulfillmentMethod: getUserLocationFulfillmentMethod(state),
  });
}

export default connect(makeMapStateToProps);
