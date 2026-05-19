import { connect } from 'react-redux';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { historyPush, historyReplace } from '@shopgate/pwa-common/actions/router';
import fetchSuggestions from '@shopgate/pwa-common-commerce/search/actions/fetchSearchSuggestions';
import { getSearchHistory } from '@shopgate/pwa-common-commerce/search';
import { addSearchHistory, clearSearchHistory } from '@shopgate/pwa-common-commerce/search/action-creators/searchHistory';

/**
 * @param {Object} state The application state.
 * @returns {Object}
 */
const mapStateToProps = state => ({
  route: getCurrentRoute(state),
  searchHistory: getSearchHistory(state),
});

/**
 * Maps action dispatchers to the component props.
 * @param {Function} dispatch The store dispatcher.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  fetchSuggestions: query => dispatch(fetchSuggestions(query)),
  historyPush: route => dispatch(historyPush(route)),
  historyReplace: route => dispatch(historyReplace(route)),
  addSearchHistory: query => dispatch(addSearchHistory(query)),
  clearSearchHistory: query => dispatch(clearSearchHistory(query)),
});

export default connect(mapStateToProps, mapDispatchToProps);
