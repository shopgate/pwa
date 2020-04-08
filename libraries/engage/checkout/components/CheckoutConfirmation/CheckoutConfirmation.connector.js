import { connect } from 'react-redux';
import { getCheckoutOrder, getCheckoutOrderLineItemsAsCartItems } from '../../selectors/order';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  return state => ({
    order: getCheckoutOrder(state),
    cartItems: getCheckoutOrderLineItemsAsCartItems(state),
  });
}

export default connect(makeMapStateToProps);
