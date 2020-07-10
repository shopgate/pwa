import { connect } from 'react-redux';
import {
  getProductFulfillmentMethods,
  ROPIS,
  BOPIS,
} from '@shopgate/engage/locations';
import { makeGetEnabledFulfillmentMethods } from '@shopgate/engage/core';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  const getEnabledFulfillmentMethods = makeGetEnabledFulfillmentMethods();

  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {Object}
   */
  return (state, props) => {
    const enabledFulfillmentMethods = getEnabledFulfillmentMethods(state) || false;
    const productFulfillmentMethods = getProductFulfillmentMethods(state, props);

    const merchantHasROPE =
      enabledFulfillmentMethods &&
      (enabledFulfillmentMethods.includes(ROPIS) ||
      enabledFulfillmentMethods.includes(BOPIS));

    const productHasROPE =
      !!(productFulfillmentMethods &&
      (productFulfillmentMethods.includes(ROPIS) ||
      productFulfillmentMethods.includes(BOPIS)));

    let isROPEActive = false;

    if (merchantHasROPE) {
      if (productFulfillmentMethods === null) {
        isROPEActive = true;
      } else if (productHasROPE) {
        isROPEActive = productHasROPE;
      }
    }

    return {
      isROPEActive,
    };
  };
}

export default connect(makeMapStateToProps);
