// @flow
import { connect } from 'react-redux';
import { makeGetMerchantSettings } from '@shopgate/engage/core';
import { makeGetUserFormInput } from '../../selectors';
import { type OwnProps, type StateProps } from './Fulfillment.types';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  const getUserFormInput = makeGetUserFormInput();
  const getMerchantSettings = makeGetMerchantSettings();

  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {Object}
   */
  return state => ({
    userInput: getUserFormInput(state),
    settings: getMerchantSettings(state),
  });
}

export default connect<StateProps, any, OwnProps>(makeMapStateToProps);
