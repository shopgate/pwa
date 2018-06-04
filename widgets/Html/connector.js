import { connect } from 'react-redux';
import { ACTION_PUSH } from '@virtuous/conductor/constants';
import { navigate } from '@shopgate/pwa-common/action-creators/router';

/**
 * Connects the dispatch function to a calleble function in the props.
 * @param  {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  navigate: location => dispatch(navigate(ACTION_PUSH, location)),
});

export default connect(null, mapDispatchToProps, null, { pure: () => true });
