import { connect } from 'react-redux';
import { makeGetUserLocation } from '@shopgate/engage/user';
import { makeGetFulfillmentMethods } from '../../selectors';

/**
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
function makeMapStateToProps() {
  const getUserLocation = makeGetUserLocation();
  const getFulfillmentMethods = makeGetFulfillmentMethods();

  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {Object}
   */
  return (state, props) => ({
    fulfillmentMethods: getFulfillmentMethods(state, props),
    location: getUserLocation(state),
  });
}

export default connect(makeMapStateToProps);
