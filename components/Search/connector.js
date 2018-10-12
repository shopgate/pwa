import { connect } from 'react-redux';
import { historyPush } from '@shopgate/pwa-common/actions/router';
import fetchSearchSuggestions from '@shopgate/pwa-common-commerce/search/actions/fetchSearchSuggestions';

/**
 * @param {Function} dispatch The store dispatcher.
 * @return {Object}
 */
const mapDispatchToProps = dispatch => ({
  fetchSuggestions: query => dispatch(fetchSearchSuggestions(query)),
  navigate: pathname => dispatch(historyPush({ pathname })),
});

export default connect(null, mapDispatchToProps);
