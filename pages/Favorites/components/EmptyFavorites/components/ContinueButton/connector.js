import { connect } from 'react-redux';
import { ACTION_POP } from '@virtuous/conductor/constants';
import { navigate } from '@shopgate/pwa-common/action-creators/router';

/**
 * Maps action dispatchers to the component props.
 * @param {function} dispatch The store dispatcher.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  goBackHistory: () => dispatch(navigate(ACTION_POP)),
});

export default connect(null, mapDispatchToProps);
