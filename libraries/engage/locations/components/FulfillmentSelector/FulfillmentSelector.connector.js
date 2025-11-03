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

/* eslint-disable max-len */
/** @typedef {import('./FulfillmentSelector.types').OwnProps} OwnProps */
/** @typedef {import('./FulfillmentSelector.types').StateProps} StateProps */
/** @typedef {import('./FulfillmentSelector.types').DispatchProps} DispatchProps */

/**
 * Maps state to props for the component.
 * @returns {function(state: any, props: OwnProps): StateProps} A function that maps state and props to StateProps.
 */
const makeMapStateToProps = () => {
  /**
   * Retrieves the location code based on the state and props.
   * @param {any} state The application state.
   * @param {OwnProps} props The component props.
   * @returns {string|null} The location code.
   */
  const getLocationCode = (state, props) => getPreferredLocation(state, props)?.code;
  /**
   * Retrieves the product code based on the props.
   * @param {any} _ Unused state parameter.
   * @param {OwnProps} props The component props.
   * @returns {string|null} The product code.
   */
  const getProductCode = (_, props) => props.variantId || props.productId || null;

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
   * @param {OwnProps} props The component props.
   * @returns {StateProps} The mapped state props.
   */
  return (state, props) => {
    const hasVariants = hasProductVariants(state, props);
    const baseProductActive = isBaseProductActive(state, props);

    return {
      merchantSettings: {
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
};
/* eslint-enable max-len */

/**
 * Maps dispatch actions to props for the component.
 * @type {DispatchProps}
 */
const mapDispatchToProps = {
  storeFulfillmentMethod,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
