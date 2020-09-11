import { connect } from 'react-redux';
import { isIos } from '@shopgate/pwa-common/selectors/client';
import {
  hasCouponSupport,
  getCouponFieldValue,
  getCouponFieldError,
  addCouponsToCart,
  setCouponFieldValue,
} from '@shopgate/engage/cart';

/**
 * Connects the component with the state.
 * @param {Object} state The application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  isIos: isIos(state),
  isSupported: hasCouponSupport(state),
  error: getCouponFieldError(state),
  value: getCouponFieldValue(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  addCoupon: couponId => dispatch(addCouponsToCart([couponId])),
  setValue: value => dispatch(setCouponFieldValue(value)),
});

export default connect(mapStateToProps, mapDispatchToProps);
