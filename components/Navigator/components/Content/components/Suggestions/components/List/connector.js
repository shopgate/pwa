import { connect } from 'react-redux';
import { ACTION_PUSH } from '@virtuous/conductor/constants';
import { navigate } from '@shopgate/pwa-common/action-creators/router';
import { getSuggestions } from '@shopgate/pwa-common-commerce/search/selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  suggestions: getSuggestions(state, props),
});

/**
 * Maps action dispatchers to the component props.
 * @param {function} dispatch The store dispatcher.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  navigate: href => dispatch(navigate(ACTION_PUSH, href)),
});

export default connect(mapStateToProps, mapDispatchToProps);
