import { connect } from 'react-redux';
import { getGeolocation } from '@shopgate/engage/core';
import {
  makeGetIsFetchingProductLocations,
  fetchProductLocations,
  getProduct,
} from '@shopgate/engage/product';

/**
 * @returns {Function}
 */
const makeMapStateToProps = () => {
  const getIsFetchingProductLocations = makeGetIsFetchingProductLocations();

  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {Object}
   */
  return (state, props) => ({
    product: getProduct(state, props),
    loading: getIsFetchingProductLocations(state, props),
  });
};

/**
 * @param {Function} dispatch The dispatch function.
 * @param {Object} ownProps The component props.
 * @returns {Object}
 */
const mapDispatchToProps = dispatch => ({
  getLocationsByGeolocation: async (productId) => {
    try {
      const location = await dispatch(getGeolocation({ useSettingsModal: true }));
      dispatch(fetchProductLocations(productId, location));
    } catch (e) {
      // Nothing to do here.
    }
  },
  getLocationsByPostalCode: (productId, postalCode) => {
    if (!postalCode) {
      return;
    }

    dispatch(fetchProductLocations(productId, {
      postalCode,
    }));
  },
});

export default connect(makeMapStateToProps, mapDispatchToProps);
