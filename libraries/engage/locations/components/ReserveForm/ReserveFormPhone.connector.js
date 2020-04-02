// @flow
import { connect } from 'react-redux';
import { makeGetUserLocationAddress } from '../../selectors';
import { type OwnProps, type StateProps } from './ReserveFormPhone.types';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  const getUserLocationAddress = makeGetUserLocationAddress();

  return state => ({
    userLocation: getUserLocationAddress(state),
  });
}

export default connect<StateProps, any, OwnProps>(makeMapStateToProps);
