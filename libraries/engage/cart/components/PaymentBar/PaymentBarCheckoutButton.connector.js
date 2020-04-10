// @flow
import { connect } from 'react-redux';
import { getOrderableStatus } from '@shopgate/pwa-common-commerce/cart/selectors';
import { isGuestCheckoutActive } from '@shopgate/engage/checkout';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  isOrderable: getOrderableStatus(state),
  isGuestCheckoutActive: isGuestCheckoutActive(state),
});

export default connect(mapStateToProps);
