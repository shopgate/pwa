import { connect } from 'react-redux';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { historyPush, historyReplace } from '@shopgate/pwa-common/actions/router';
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
