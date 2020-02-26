// @flow
import { connect } from 'react-redux';
import { makeGetMerchantSettings } from '../../../core/config/config.selectors';
import { type OwnProps, type StateProps } from './FulfillmentPathSelector.types';
import { type State } from '../../../types';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  const getMerchantSettings = makeGetMerchantSettings();

  return (state: State) => ({
    settings: getMerchantSettings(state),
  });
}

export default connect<StateProps, any, OwnProps>(makeMapStateToProps);
