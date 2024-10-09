import { connect } from 'react-redux';
import {
  getUserSearchPostalCode,
  getUserSearchCountryCode,
} from '../../selectors';
import {
  setUserSearchPostalCode,
  setUserSearchCountryCode,
} from '../../action-creators';
import {
  setUserSearchGeolocation,
} from '../../actions';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  /**
   * @param {Object} state The application state.
   * @param {Object} props The component props.
   * @returns {Object}
   */
  return state => ({
    postalCode: getUserSearchPostalCode(state),
    countryCode: getUserSearchCountryCode(state),
  });
}

const mapDispatchToProps = {
  setPostalCode: setUserSearchPostalCode,
  setCountryCode: setUserSearchCountryCode,
  setGeolocation: setUserSearchGeolocation,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
