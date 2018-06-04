import { connect } from 'react-redux';
import { navigate } from '@shopgate/pwa-common/action-creators/router';
import { ACTION_PUSH } from '@virtuous/conductor/constants';

/**
 * Maps action dispatchers to the component props.
 * @param {function} dispatch The store dispatcher.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  navigate: (href, state) => dispatch(navigate(ACTION_PUSH, href, state)),
});

/**
 * @returns {boolean}
 */
const areStatePropsEqual = () => true;

export default connect(null, mapDispatchToProps, null, { areStatePropsEqual });
