// @flow
import { connect } from 'react-redux';
import {
  hasProductVariants,
  isProductOrderable,
  makeIsBaseProductActive,
} from '@shopgate/engage/product';
import { DIRECT_SHIP, ROPIS, BOPIS } from '../../constants';
import {
  makeGetEnabledFulfillmentMethods,
  makeGetFulfillmentPaths,
  makeUseLocationFulfillmentMethods,
} from '../../../core/config';
import { getProductShowAlternativeLocation } from '../../../core/selectors';
import { MERCHANT_SETTINGS_PRODUCT_SHOW_ALTERNATIVE_LOCATION } from '../../../core/constants';
import {
  makeIsFulfillmentSelectorMethodEnabled,
  getPreferredLocation,
  makeGetLocationInventory,
  makeGetLocationFulfillmentMethods,
  getPreferredFulfillmentMethod,
  getProductFulfillmentMethods,
  getUserSearch,
} from '../../selectors';
import { storeFulfillmentMethod } from '../../action-creators';
import { type OwnProps, type StateProps, type DispatchProps } from './FulfillmentSelector.types';

/**
 * @return {Function} The extended component props.
 */
function makeMapStateToProps() {
  /* eslint-disable require-jsdoc */
  const getLocationCode = (state, props) => getPreferredLocation(state, props)?.code;
  const getProductCode = (_, props) => props.variantId || props.productId || null;
  /* eslint-enable require-jsdoc */

  const getFulfillmentPaths = makeGetFulfillmentPaths();
  const isDirectShipEnabled = makeIsFulfillmentSelectorMethodEnabled(
    getLocationCode,
    getProductCode,
    DIRECT_SHIP
  );
  const isROPISEnabled = makeIsFulfillmentSelectorMethodEnabled(
    getLocationCode,
    getProductCode,
    ROPIS,
    // Set to true when fulfillment methods shall not be disabled that are not supported by location
    false
  );
  const isBOPISEnabled = makeIsFulfillmentSelectorMethodEnabled(
    getLocationCode,
    getProductCode,
    BOPIS,
    // Set to true when fulfillment methods shall not be disabled that are not supported by location
    false
  );
  const getInventory = makeGetLocationInventory(getLocationCode, getProductCode);
  const getEnabledFulfillmentMethods = makeGetEnabledFulfillmentMethods();
  const getLocationFulfillmentMethods = makeGetLocationFulfillmentMethods(getLocationCode);
  const isBaseProductActive = makeIsBaseProductActive();
  const useLocationFulfillmentMethods = makeUseLocationFulfillmentMethods();

  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {Object}
   */
  return (state, props) => {
    const hasVariants = hasProductVariants(state, props);
    const baseProductActive = isBaseProductActive(state, props);

    return {
      merchantSettings: {
        // eslint-disable-next-line max-len
        [MERCHANT_SETTINGS_PRODUCT_SHOW_ALTERNATIVE_LOCATION]: getProductShowAlternativeLocation(state),
      },
      fulfillmentPaths: getFulfillmentPaths(state),
      shopFulfillmentMethods: getEnabledFulfillmentMethods(state),
      productFulfillmentMethods: getProductFulfillmentMethods(state, props),
      locationFulfillmentMethods: getLocationFulfillmentMethods(state, props),
      useLocationFulfillmentMethods: useLocationFulfillmentMethods(state, props),
      userFulfillmentMethod: getPreferredFulfillmentMethod(state, props),
      preferredLocation: getPreferredLocation(state, props),
      inventory: getInventory(state, props),
      isDirectShipEnabled: isDirectShipEnabled(state, props),
      isROPISEnabled: isROPISEnabled(state, props),
      isBOPISEnabled: isBOPISEnabled(state, props),
      isOrderable: isProductOrderable(state, props) || !!hasVariants,
      isReady: hasVariants !== null && (!hasVariants || !baseProductActive),
      userSearch: getUserSearch(state),
    };
  };
}

const mapDispatchToProps = {
  storeFulfillmentMethod,
};

export default connect<StateProps, DispatchProps, OwnProps>(
  makeMapStateToProps,
  mapDispatchToProps
);
