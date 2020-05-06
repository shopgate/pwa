import { connect } from 'react-redux';
import { makeGetEnabledFulfillmentMethodsCount } from '@shopgate/engage/core/config';

/**
 * @return {Function} The extended component props.
 */
const makeMapStateToProps = () => {
  const getEnabledFulfillmentMethodsCount = makeGetEnabledFulfillmentMethodsCount();

  return state => ({
    enabledFulfillmentMethodsCount: getEnabledFulfillmentMethodsCount(state),
  });
};

export default connect(makeMapStateToProps);
