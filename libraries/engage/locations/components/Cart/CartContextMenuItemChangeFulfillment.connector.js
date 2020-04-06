import { connect } from 'react-redux';
import { makeGetEnabledFulfillmentMethods } from '@shopgate/engage/core';

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => {
  const getEnabledFulfillmentMethods = makeGetEnabledFulfillmentMethods();
  return (state, props) => ({
    enabledFulfillmentMethods: getEnabledFulfillmentMethods(state, props),
  });
};

export default connect(makeMapStateToProps);
