import { connect } from 'react-redux';
import { navigate } from '@shopgate/pwa-common/action-creators/router';
import { ACTION_POP } from '@virtuous/conductor/constants';

/**
 * Maps action dispatchers to the component props.
 * @param {function} dispatch The store dispatcher.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  goBackHistory: () => dispatch(navigate(ACTION_POP)),
});

export default connect(null, mapDispatchToProps);
