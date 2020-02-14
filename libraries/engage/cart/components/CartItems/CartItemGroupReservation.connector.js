import { connect } from 'react-redux';
import { makeGetLocation } from '../../../locations';

/**
 * Creates the mapStateToProps connector function.
 * @returns {Function}
 */
const makeMapStateToProps = () => {
  const getLocation = makeGetLocation();
  return (state, props) => ({
    location: getLocation(state, props),
  });
};

export default connect(makeMapStateToProps);
