import { connect } from 'react-redux';
import {
  getDiscounts,
  getShippingCost,
  getSubTotal,
  getGrandTotal,
  getTax,
} from '@shopgate/pwa-common-commerce/cart/selectors';

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => (state, props) => ({
  discounts: getDiscounts(state, props),
  shippingCosts: getShippingCost(state, props),
  subTotal: getSubTotal(state, props),
  grandTotal: getGrandTotal(state, props),
  tax: getTax(state, props),
});

export default connect(makeMapStateToProps);
