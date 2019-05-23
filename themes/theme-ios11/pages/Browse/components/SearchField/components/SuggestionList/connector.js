import { connect } from 'react-redux';
import {
  getSuggestions,
  getSuggestionsFetchingState,
} from '@shopgate/engage/search';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  suggestions: getSuggestions(state, props),
  fetching: getSuggestionsFetchingState(state, props),
});

export default connect(mapStateToProps);
