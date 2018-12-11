import { connect } from 'react-redux';
import { historyPush, historyReplace } from '@shopgate/pwa-common/actions/router';
import fetchSuggestions from '@shopgate/pwa-common-commerce/search/actions/fetchSearchSuggestions';

const mapDispatchToProps = {
  fetchSuggestions,
  historyPush,
  historyReplace,
};

export default connect(null, mapDispatchToProps);
