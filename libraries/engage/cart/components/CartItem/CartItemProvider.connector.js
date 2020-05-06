import { connect } from 'react-redux';
import { makeGetEnabledFulfillmentMethodsCount } from '@shopgate/engage/core/config';

/**
 * @return {Function} The extended component props.
 */
const makeMapStateToProps = () => {
  const getEnabledFulfillmentMethods = makeGetEnabledFulfillmentMethodsCount();

  return state => ({
    enabledFulfillmentMethodsCount: getEnabledFulfillmentMethods(state),
  });
};

export default connect(makeMapStateToProps);
