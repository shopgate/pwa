// @flow
import { connect } from 'react-redux';

import { getFulfillmentSchedulingEnabled } from '@shopgate/engage/core';
import setFulfillmentSlot from '@shopgate/pwa-common-commerce/cart/action-creators/setFulfillmentSlot';

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => state => ({
  isFulfillmentScheduling: getFulfillmentSchedulingEnabled(state),
});

/**
 * Maps the contents of the state to the component props.
 * @param  {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = {
  setFulfillmentSlot,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
