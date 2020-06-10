import { connect } from 'react-redux';
import { makeGetEnabledFulfillmentMethodsCount } from '@shopgate/engage/core/config';
import { makeGetLocation } from '@shopgate/engage/locations';

/**
 * @return {Function} The extended component props.
 */
const makeMapStateToProps = () => {
  const getEnabledFulfillmentMethods = makeGetEnabledFulfillmentMethodsCount();
  const getLocation = makeGetLocation();

  return (state, props) => ({
    location: getLocation(state, props),
    enabledFulfillmentMethodsCount: getEnabledFulfillmentMethods(state),
  });
};

export default connect(makeMapStateToProps);
