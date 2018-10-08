import { connect } from 'react-redux';
import { CART_PATH } from '@shopgate/pwa-common-commerce/cart/constants';
import pushHistory from '@shopgate/pwa-common/actions/history/pushHistory';

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  openCart: () => dispatch(pushHistory(CART_PATH)),
});

export default connect(null, mapDispatchToProps);
