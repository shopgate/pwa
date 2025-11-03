import { connect } from 'react-redux';
import deleteCouponsFromCart from '@shopgate/pwa-common-commerce/cart/actions/deleteCouponsFromCart';
import { getCurrency } from '@shopgate/pwa-common-commerce/cart/selectors';

/**
 * @typedef {import('./CartItemCoupon.types').OwnProps} OwnProps
 * @typedef {import('./CartItemCoupon.types').StateProps} StateProps
 * @typedef {import('./CartItemCoupon.types').DispatchProps} DispatchProps
 */

/**
 * Maps state to props.
 * @param {Object} state The current application state.
 * @returns {StateProps} The extended component props.
 */
const mapStateToProps = state => ({
  currency: getCurrency(state),
});

/**
 * Maps dispatch to props.
 * @param {Function} dispatch The redux dispatch function.
 * @returns {DispatchProps} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  deleteCoupon: couponCode => dispatch(deleteCouponsFromCart([couponCode])),
});

export default connect(mapStateToProps, mapDispatchToProps);
