import { connect } from 'react-redux';
import { makeGetMerchantSettings } from '../../../core/config';

/**
 * @return {Function}
 */
function makeMapStateToProps() {
  const getMerchantSettings = makeGetMerchantSettings();

  /**
   * @param {Object} state The application state.
   * @returns {Object}
   */
  return (state) => {
    const { enabledFulfillmentMethodSelectionForEngage = [] } = getMerchantSettings(state);

    return {
      fulfillmentPaths: enabledFulfillmentMethodSelectionForEngage,
    };
  };
}

export default connect(makeMapStateToProps);
