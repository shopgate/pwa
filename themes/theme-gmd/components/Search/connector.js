import { connect } from 'react-redux';
import { getCurrentRoute, historyPush, historyReplace } from '@shopgate/engage/core';
import fetchSuggestions from '@shopgate/pwa-common-commerce/search/actions/fetchSearchSuggestions';

/**
 * @param {Object} state The application state.
 * @returns {Object}
 */
const mapStateToProps = state => ({
  route: getCurrentRoute(state),
});

const mapDispatchToProps = {
  fetchSuggestions,
  historyPush,
  historyReplace,
};

export default connect(mapStateToProps, mapDispatchToProps);
