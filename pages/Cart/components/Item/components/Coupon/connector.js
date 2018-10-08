import { connect } from 'react-redux';
import deleteCouponsFromCart from '@shopgate/pwa-common-commerce/cart/actions/deleteCouponsFromCart';
import { getCurrency } from '@shopgate/pwa-common-commerce/cart/selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  currency: getCurrency(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  deleteCoupon: couponCode => dispatch(deleteCouponsFromCart([couponCode])),
});

export default connect(mapStateToProps, mapDispatchToProps);
