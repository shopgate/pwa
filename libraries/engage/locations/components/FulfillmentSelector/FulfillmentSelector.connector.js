// @flow
import { connect } from 'react-redux';
import {
  makeGetEnabledFulfillmentMethods,
} from '../../../core/config';
import {
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
  const isFulfillmentSelectorDisabled = makeIsFulfillmentSelectorDisabled();
  const getProductLocation = makeGetProductLocation(true);
  const getUserLocationFulfillmentMethod = makeGetUserLocationFulfillmentMethod();
  const getEnabledFulfillmentMethods = makeGetEnabledFulfillmentMethods();

  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {Object}
   */
  return (state, props) => ({
    shopFulfillmentMethods: getEnabledFulfillmentMethods(state),
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
