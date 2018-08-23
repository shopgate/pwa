import { connect } from 'react-redux';
import { isIos } from '@shopgate/pwa-common/selectors/client';
import addCouponsToCart from '@shopgate/pwa-common-commerce/cart/actions/addCouponsToCart';
import { hasCouponSupport } from '@shopgate/pwa-common-commerce/cart/selectors';
import { isCurrentViewLoading } from '@shopgate/pwa-common/selectors/view';

/**
 * Connects the component with the state.
 * @param {Object} state The application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  isIos: isIos(state),
  isLoading: isCurrentViewLoading(state),
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
