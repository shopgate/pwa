import { connect } from 'react-redux';
import { historyPush } from '@shopgate/engage/core';
import { fetchOrderHistory } from '../actions';
import { getOrders, getTotalOrderCount } from '../selectors';

/**
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {Object}
   */
const mapStateToProps = state => ({
  orders: getOrders(state),
  totalOrderCount: getTotalOrderCount(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = {
  fetchOrderHistory,
  historyPush,
};

export default connect(mapStateToProps, mapDispatchToProps);
