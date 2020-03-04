// @flow
import { connect } from 'react-redux';
import {
  makeGetFulfillmentMethods,
  makeIsFulfillmentSelectorDisabled,
  makeGetUserLocation,
  makeGetProductLocation,
  makeGetUserLocationFulfillmentMethod,
} from '../../selectors';
import { storeFulfillmentMethod } from '../../action-creators';
import { type OwnProps, type StateProps, type DispatchProps } from './FulfillmentSelector.types';

/**
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
function makeMapStateToProps() {
  const getUserLocation = makeGetUserLocation();
  const getFulfillmentMethods = makeGetFulfillmentMethods();
  const isFulfillmentSelectorDisabled = makeIsFulfillmentSelectorDisabled();
  const getProductLocation = makeGetProductLocation(true);
  const getUserLocationFulfillmentMethod = makeGetUserLocationFulfillmentMethod();

  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {Object}
   */
  return (state, props) => ({
    fulfillmentMethods: getFulfillmentMethods(state, props),
    userFulfillmentMethod: getUserLocationFulfillmentMethod(state, props),
    location: getProductLocation(state, props) || getUserLocation(state),
    disabled: isFulfillmentSelectorDisabled(state, props),
  });
}

const mapDispatchToProps = {
  storeFulfillmentMethod,
};

export default connect<StateProps, DispatchProps, OwnProps>(
  makeMapStateToProps,
  mapDispatchToProps
);
