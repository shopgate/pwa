import { connect } from 'react-redux';
import {
  deleteCouponsFromCart,
} from 'Library/actions/cart';

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  deleteCoupon: couponCode => dispatch(deleteCouponsFromCart([couponCode])),
});

/**
 * Connects a component to the global store.
 * @param {Object} Component A react component.
 * @return {Object} The react component with extended props.
 */
const connector = Component =>
  connect(null, mapDispatchToProps)(Component)
;

export default connector;
