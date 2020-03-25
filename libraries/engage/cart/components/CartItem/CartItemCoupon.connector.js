// @flow
import { connect } from 'react-redux';
import deleteCouponsFromCart from '@shopgate/pwa-common-commerce/cart/actions/deleteCouponsFromCart';
import { getCurrency } from '@shopgate/pwa-common-commerce/cart/selectors';
import { type OwnProps, type StateProps, type DispatchProps } from './CartItemCoupon.types';

/**
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state): StateProps => ({
  currency: getCurrency(state),
});

/**
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = (dispatch): DispatchProps => ({
  deleteCoupon: couponCode => dispatch(deleteCouponsFromCart([couponCode])),
});

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps);
