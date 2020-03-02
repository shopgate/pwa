import { connect } from 'react-redux';
import { makeGetFulfillmentMethods } from '@shopgate/engage/locations';

/**
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
function makeMapStateToProps() {
  const getFulfillmentMethods = makeGetFulfillmentMethods();

  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {Object}
   */
  return (state, props) => ({
    hasFulfillmentMethods: !getFulfillmentMethods(state, props),
  });
}

export default connect(makeMapStateToProps);
