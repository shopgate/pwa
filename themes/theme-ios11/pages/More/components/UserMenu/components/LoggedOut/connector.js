import { connect } from 'react-redux';
import { isUserLoginDisabled } from '@shopgate/engage/user';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  isDisabled: isUserLoginDisabled(state),
});

export default connect(mapStateToProps);
