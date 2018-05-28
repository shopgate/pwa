import { connect } from 'react-redux';
import { getCurrentPathname, getCurrentSearchQuery } from '@shopgate/pwa-common/selectors/router';
import submitSearch from '../../actions/submitSearch';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  path: getCurrentPathname(state),
  searchQuery: getCurrentSearchQuery(state),
  searchActive: state.navigator.searchActive,
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  submitSearch: () => dispatch(submitSearch()),
});

export default connect(mapStateToProps, mapDispatchToProps);
