import { connect } from 'react-redux';
import { historyResetTo } from '@shopgate/engage/core';
import { CART_PATH } from '@shopgate/engage/cart';

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  test: () => {
    dispatch(historyResetTo(CART_PATH));
  },
});

export default connect(null, mapDispatchToProps);
