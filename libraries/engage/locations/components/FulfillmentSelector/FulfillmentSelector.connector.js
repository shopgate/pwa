// @flow
import { connect } from 'react-redux';
import {
  makeGetFulfillmentMethods,
  makeIsFulfillmentSelectorDisabled,
  makeGetUserLocation,
  makeGetProductLocation,
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
  const getProductLocation = makeGetProductLocation();

  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {Object}
   */
  return (state, props) => {
    const { code: locationId } = getUserLocation(state);
    const productLocation = getProductLocation(state, {
      ...props,
      locationId,
    });

    return {
      fulfillmentMethods: getFulfillmentMethods(state, props),
      location: productLocation || getUserLocation(state),
      disabled: isFulfillmentSelectorDisabled(state, props),
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
