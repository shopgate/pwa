// @flow
import { connect } from 'react-redux';
import { hasProductVariants, isProductOrderable } from '@shopgate/engage/product';
import { DIRECT_SHIP, ROPIS, BOPIS } from '../../constants';
import {
  makeGetEnabledFulfillmentMethods,
  makeGetFulfillmentPaths,
} from '../../../core/config';
import {
  makeIsFulfillmentSelectorMethodEnabled,
  makeGetUserLocation,
  makeGetProductLocation,
  makeGetUserLocationFulfillmentMethod,
  makeGetProductFulfillmentMethods,
} from '../../selectors';
import { storeFulfillmentMethod } from '../../action-creators';
import { type OwnProps, type StateProps, type DispatchProps } from './FulfillmentSelector.types';

/**
 * @return {Function} The extended component props.
 */
function makeMapStateToProps() {
  const getFulfillmentPaths = makeGetFulfillmentPaths();
  const getUserLocation = makeGetUserLocation();
  const isDirectShipEnabled = makeIsFulfillmentSelectorMethodEnabled(DIRECT_SHIP);
  const isROPISEnabled = makeIsFulfillmentSelectorMethodEnabled(ROPIS);
  const isBOPISEnabled = makeIsFulfillmentSelectorMethodEnabled(BOPIS);
  const getProductLocation = makeGetProductLocation(true);
  const getUserLocationFulfillmentMethod = makeGetUserLocationFulfillmentMethod();
  const getEnabledFulfillmentMethods = makeGetEnabledFulfillmentMethods();
  const getFulfillmentMethods = makeGetProductFulfillmentMethods();

  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {Object}
   */
  return (state, props) => {
    const hasVariants = hasProductVariants(state, props);
    return {
      fulfillmentPaths: getFulfillmentPaths(state),
      shopFulfillmentMethods: getEnabledFulfillmentMethods(state),
      productFulfillmentMethods: getFulfillmentMethods(state, props),
      userFulfillmentMethod: getUserLocationFulfillmentMethod(state, props),
      location: getProductLocation(state, props) || getUserLocation(state),
      isDirectShipEnabled: isDirectShipEnabled(state, props),
      isROPISEnabled: isROPISEnabled(state, props),
      isBOPISEnabled: isBOPISEnabled(state, props),
      isOrderable: isProductOrderable(state, props) || !!hasVariants,
      isReady: hasVariants !== null && !hasVariants,
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
