// @flow
import { connect } from 'react-redux';
import { getPreferredLocationAddress } from '../../selectors';
import { type OwnProps, type StateProps } from './ReserveFormPhone.types';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  return state => ({
    userLocation: getPreferredLocationAddress(state),
  });
}

export default connect<StateProps, any, OwnProps>(makeMapStateToProps);
