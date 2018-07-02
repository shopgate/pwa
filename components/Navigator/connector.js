import { connect } from 'react-redux';
import { isCurrentViewLoading } from '@shopgate/pwa-common/selectors/view';
import { navigate } from '@shopgate/pwa-common/action-creators/router';
import fetchSearchSuggestions from '@shopgate/pwa-common-commerce/search/actions/fetchSearchSuggestions';
import { isProgressBarShowing } from './selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  backgroundColor: state.navigator.backgroundColor,
  filterOpen: state.navigator.filterOpen,
  navigatorEnabled: state.navigator.enabled,
  searchActive: state.navigator.searchActive,
  showSearch: state.navigator.showSearch,
  showTitle: state.navigator.showTitle,
  showLoadingBar: (isProgressBarShowing(state) && isCurrentViewLoading(state)),
  textColor: state.navigator.textColor,
});

/**
 * Maps action dispatchers to the component props.
 * @param {function} dispatch The store dispatcher.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  navigate: (action, href) => dispatch(navigate(action, href)),
  fetchSearchSuggestions: searchPhrase => dispatch(fetchSearchSuggestions(searchPhrase)),
});

export default connect(mapStateToProps, mapDispatchToProps);
