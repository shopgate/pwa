import { connect } from 'react-redux';
import { navigate } from '@shopgate/pwa-common/action-creators/router';
import fetchSearchSuggestions from '@shopgate/pwa-common-commerce/search/actions/fetchSearchSuggestions';
import {
  getBackgroundColor,
  isEnabled,
  isNavSearchFieldActive,
  isSearchShowing,
  showLoadingBar,
  getTextColor,
} from './selectors';

/**
 * @param {Object} state The current application state.
 * @return {Object}
 */
const mapStateToProps = state => ({
  backgroundColor: getBackgroundColor(state),
  navigatorEnabled: isEnabled(state),
  showSearch: isSearchShowing(state),
  showLoadingBar: showLoadingBar(state),
  textColor: getTextColor(state),
});

/**
 * @param {Function} dispatch The store dispatcher.
 * @return {Object}
 */
const mapDispatchToProps = dispatch => ({
  navigate: (action, pathname) => dispatch(navigate({
    action,
    pathname,
  })),
  fetchSearchSuggestions: searchPhrase => dispatch(fetchSearchSuggestions(searchPhrase)),
});

export default connect(mapStateToProps, mapDispatchToProps);
