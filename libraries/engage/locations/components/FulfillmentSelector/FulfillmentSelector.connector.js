// @flow
import { connect } from 'react-redux';
import { hasProductVariants, isProductOrderable } from '@shopgate/engage/product';
import {
  makeGetEnabledFulfillmentMethods,
  makeGetFulfillmentPaths,
} from '../../../core/config';
import {
  makeIsFulfillmentSelectorDisabled,
  makeGetUserLocation,
  makeGetProductLocation,
  makeGetUserLocationFulfillmentMethod,
  makeGetFulfillmentMethods,
} from '../../selectors';
import { storeFulfillmentMethod } from '../../action-creators';
import { type OwnProps, type StateProps, type DispatchProps } from './FulfillmentSelector.types';

/**
 * @return {Function} The extended component props.
 */
function makeMapStateToProps() {
  const getFulfillmentPaths = makeGetFulfillmentPaths();
  const getUserLocation = makeGetUserLocation();
  const isFulfillmentSelectorDisabled = makeIsFulfillmentSelectorDisabled();
  const getProductLocation = makeGetProductLocation(true);
  const getUserLocationFulfillmentMethod = makeGetUserLocationFulfillmentMethod();
  const getEnabledFulfillmentMethods = makeGetEnabledFulfillmentMethods();
  const getFulfillmentMethods = makeGetFulfillmentMethods();

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
      disabled: isFulfillmentSelectorDisabled(state, props),
      isOrderable: isProductOrderable(state, props) || hasVariants,
      isReady: !hasVariants,
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
