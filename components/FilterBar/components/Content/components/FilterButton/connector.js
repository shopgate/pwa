import { connect } from 'react-redux';
import openFilterRoute from '../../actions/openFilterRoute';

/**
 * @param {Function} dispatch The redux dispatch function.
 * @param {Object} props The components props.
 * @return {Object}
 */
const mapDispatchToProps = dispatch => ({
  navigate: () => dispatch(openFilterRoute()),
});

export default connect(null, mapDispatchToProps);
