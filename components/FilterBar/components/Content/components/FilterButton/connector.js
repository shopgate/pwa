import { connect } from 'react-redux';
import openFilterView from '../../actions/openFilterView';

/**
 * @param {Function} dispatch The redux dispatch function.
 * @param {Object} props The components props.
 * @return {Object}
 */
const mapDispatchToProps = dispatch => ({
  navigate: () => dispatch(openFilterView()),
});

export default connect(null, mapDispatchToProps, null, { pure: () => null });
