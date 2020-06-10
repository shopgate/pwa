import { connect } from 'react-redux';
import { getShopSettings, getConfigFetching } from '@shopgate/engage/core/config';
import { makeGetUserLocationAddress } from '@shopgate/engage/locations/selectors';
import { isUserLoggedIn } from '@shopgate/pwa-common/selectors/user';
import { makeGetOrderById } from '../selectors';
import { fetchOrderDetails } from '../actions';

/**
 * @return {Function}
 */
const makeMapStateToProps = () => {
  const getUserLocationAddress = makeGetUserLocationAddress();
  const getOrderById = makeGetOrderById();

  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {Object}
   */
  return (state, props) => ({
    isDataReady: !getConfigFetching(state),
    isUserLoggedIn: isUserLoggedIn(state),
    shopSettings: getShopSettings(state),
    userLocation: getUserLocationAddress(state),
    order: getOrderById(state, props),
  });
};

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  fetchOrderDetails: (orderNumber, mail, phone) =>
    dispatch(fetchOrderDetails(orderNumber, mail, phone)),
});

export default connect(makeMapStateToProps, mapDispatchToProps);
