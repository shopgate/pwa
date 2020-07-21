import { connect } from 'react-redux';
import {
  getFilteredLocations,
  getPreferredLocation,
} from '../selectors';

/**
 * @returns {Function}
 */
const makeMapStateToProps = () => (state, props) => ({
  locations: getFilteredLocations(state, props),
  preferredLocation: getPreferredLocation(state, props),
});

export default connect(makeMapStateToProps);
