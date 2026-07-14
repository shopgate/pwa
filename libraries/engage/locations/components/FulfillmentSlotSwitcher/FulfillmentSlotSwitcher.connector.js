import { connect } from 'react-redux';

import { getFulfillmentSchedulingEnabled } from '@shopgate/engage/settings/selectors/merchantSettings';
import {
  getActiveFulfillmentSlot,
  checkActiveFulfillmentSlotBelongsToPreferredLocation,
} from '@shopgate/engage/cart/cart.selectors';
import { getIsCartStateConfigurable } from '../../selectors';

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => state => ({
  isFulfillmentScheduling: getFulfillmentSchedulingEnabled(state),
  fulfillmentSlot: getActiveFulfillmentSlot(state),
  isFulfillmentSlotValid: checkActiveFulfillmentSlotBelongsToPreferredLocation(state),
  editable: getIsCartStateConfigurable(state),
});

export default connect(makeMapStateToProps);
