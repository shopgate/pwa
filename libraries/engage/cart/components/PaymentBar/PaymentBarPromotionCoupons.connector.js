import { connect } from 'react-redux';
import { getPromotionCoupons, deleteCouponsFromCart } from '@shopgate/engage/cart';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  coupons: getPromotionCoupons(state),
});

/**
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  deleteCoupon: couponCode => dispatch(deleteCouponsFromCart([couponCode])),
});

export default connect(mapStateToProps, mapDispatchToProps);
