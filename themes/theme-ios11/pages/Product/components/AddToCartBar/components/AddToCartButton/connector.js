import { connect } from 'react-redux';
import { CART_PATH } from '@shopgate/engage/cart';
import { historyPush } from '@shopgate/engage/core';

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  openCart: () => dispatch(historyPush({ pathname: CART_PATH })),
});

export default connect(null, mapDispatchToProps);
