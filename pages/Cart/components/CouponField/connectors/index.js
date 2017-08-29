import connect from 'Library/helpers/routedConnect';
import { addCouponsToCart } from 'Library/actions/cart';
import { isCurrentViewLoading } from 'Library/selectors/view';

/**
 * Connects the component with the state.
 * @param {Object} state The application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  isLoading: isCurrentViewLoading(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  addCoupon: couponId => dispatch(addCouponsToCart([couponId])),
});

/**
 * Connects a component to the global store.
 * @param {Object} Component A react component.
 * @return {Object} The react component with extended props.
 */
const connector = Component =>
  connect(mapStateToProps, mapDispatchToProps)(Component)
;

export default connector;
