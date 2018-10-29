import { connect } from 'react-redux';
import fetchSearchSuggestions from '@shopgate/pwa-common-commerce/search/actions/fetchSearchSuggestions';
import { historyPush } from '@shopgate/pwa-common/actions/router';
import { SEARCH_PATH } from '@shopgate/pwa-common-commerce/search/constants';

/**
 * Maps action dispatchers to the component props.
 * @param {function} dispatch The store dispatcher.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  fetchSuggestions: query => dispatch(fetchSearchSuggestions(query)),
  submitSearch: query => dispatch(historyPush({
    pathname: `${SEARCH_PATH}?s=${encodeURIComponent(query)}`,
  })),
});

/**
 * Connects a component to the store.
 * @param {Object} Component A react component.
 * @return {Object} The react component with extended props.
 */
export default connect(null, mapDispatchToProps);
