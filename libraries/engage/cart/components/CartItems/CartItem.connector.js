import { connect } from 'react-redux';
import { makeGetLocation } from '@shopgate/engage/locations';

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => {
  const getLocation = makeGetLocation((_, props) => props.locationId);
  return (state, props) => ({
    location: getLocation(state, props),
  });
};

export default connect(makeMapStateToProps);
