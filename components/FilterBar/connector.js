import { connect } from 'react-redux';
import { isFilterBarActive } from './selectors';

/**
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object}
 */
const mapStateToProps = (state, props) => ({
  isActive: isFilterBarActive(state, props),
});

export default connect(mapStateToProps);
