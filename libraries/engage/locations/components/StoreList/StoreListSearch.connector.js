// @flow
import { connect } from 'react-redux';
import {
  makeGetUserSearchPostalCode,
  makeGetUserSearchCountryCode,
} from '../../selectors';
import {
  setUserSearchPostalCode,
  setUserSearchCountryCode,
} from '../../action-creators';
import { fetchProductLocationsByUserSearch } from '../../actions';

/**
 * @returns {Function}
 */
function makeMapStateToProps() {
  const getUserSearchPostalCode = makeGetUserSearchPostalCode();
  const getUserSearchCountryCode = makeGetUserSearchCountryCode();

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
  getProductLocations: fetchProductLocationsByUserSearch,
  setPostalCode: setUserSearchPostalCode,
  setCountryCode: setUserSearchCountryCode,
};

export default connect(makeMapStateToProps, mapDispatchToProps);
