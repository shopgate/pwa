import { connect } from 'react-redux';
import { getPreferredLocationAddress } from '../../selectors';

/**
 * @typedef {import('./ReserveFormPhone.types').OwnProps} OwnProps
 * @typedef {import('./ReserveFormPhone.types').StateProps} StateProps
 */

/**
 * Maps state to props.
 * @returns {function(Object): StateProps} A function that maps state to props.
 */
const makeMapStateToProps = () => state => ({
  userLocation: getPreferredLocationAddress(state),
});

export default connect(makeMapStateToProps);
