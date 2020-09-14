// @flow
import { connect } from 'react-redux';

import { getFulfillmentSchedulingEnabled } from '@shopgate/engage/core';
import { getActiveFulfillmentSlot } from '@shopgate/pwa-common-commerce/cart/selectors';
import setFulfillmentSlot from '@shopgate/pwa-common-commerce/cart/action-creators/setFulfillmentSlot';
import { getIsCartStateConfigurable } from '../../selectors';

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => state => ({
  isFulfillmentScheduling: getFulfillmentSchedulingEnabled(state),
  fulfillmentSlot: getActiveFulfillmentSlot(state),
  editable: getIsCartStateConfigurable(state),
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
