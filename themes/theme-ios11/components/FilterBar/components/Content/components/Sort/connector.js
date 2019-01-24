import { connect } from 'react-redux';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { historyReplace } from '@shopgate/pwa-common/actions/router';

/**
 * @param {Object} state The application state.
 * @returns {Object}
 */
const mapStateToProps = state => ({
  route: getCurrentRoute(state),
});

const mapDispatchToProps = {
  historyReplace: params => historyReplace(params),
};

export default connect(mapStateToProps, mapDispatchToProps);
