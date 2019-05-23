import { connect } from 'react-redux';
import { isIos } from '@shopgate/engage/core';
import { addCouponsToCart, hasCouponSupport } from '@shopgate/engage/cart';

/**
 * Connects the component with the state.
 * @param {Object} state The application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  isIos: isIos(state),
  isSupported: hasCouponSupport(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  addCoupon: couponId => dispatch(addCouponsToCart([couponId])),
});

export default connect(mapStateToProps, mapDispatchToProps);
