import { connect } from 'react-redux';
import { getShopSettings, getConfigFetching } from '@shopgate/engage/core/config';
import { getPreferredLocationAddress } from '@shopgate/engage/locations/selectors';
import { isUserLoggedIn } from '@shopgate/pwa-common/selectors/user';
import { makeGetOrderByNumber } from '../selectors';
import { fetchOrderDetails, cancelOrder } from '../actions';

/**
 * @return {Function}
 */
const makeMapStateToProps = () => {
  const getOrderByNumber = makeGetOrderByNumber();

  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {Object}
   */
  return (state, props) => ({
    isDataReady: !getConfigFetching(state),
    isUserLoggedIn: isUserLoggedIn(state),
    shopSettings: getShopSettings(state),
    userLocation: getPreferredLocationAddress(state),
    order: getOrderByNumber(state, props),
  });
};

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  fetchOrderDetails: orderNumber =>
    dispatch(fetchOrderDetails({ orderNumber })),
  cancelOrder: orderNumber =>
    dispatch(cancelOrder({ orderNumber })),
});

export default connect(makeMapStateToProps, mapDispatchToProps);
