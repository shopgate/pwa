import { connect } from 'react-redux';
import { navigate } from '@shopgate/pwa-common/action-creators/router';
import fetchSearchSuggestions from '@shopgate/pwa-common-commerce/search/actions/fetchSearchSuggestions';

/**
 * @param {Function} dispatch The store dispatcher.
 * @return {Object}
 */
const mapDispatchToProps = dispatch => ({
  navigate: (action, pathname) => dispatch(navigate({
    action,
    pathname,
  })),
  fetchSuggestions: searchPhrase => dispatch(fetchSearchSuggestions(searchPhrase)),
});

export default connect(null, mapDispatchToProps);
