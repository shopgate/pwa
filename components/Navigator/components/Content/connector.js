import { connect } from 'react-redux';
import { getQueryParam } from '@shopgate/pwa-common/selectors/history';
import submitSearch from '../../actions/submitSearch';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  getQueryParam: param => getQueryParam(state, param),
  path: state.history.pathname,
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
