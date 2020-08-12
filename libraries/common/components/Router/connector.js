import { connect } from 'react-redux';
import { isUserLoggedIn } from '../../selectors/user';

/**
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  isUserLoggedIn: isUserLoggedIn(state),
});

export default connect(mapStateToProps);
