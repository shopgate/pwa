import { connect } from 'react-redux';
import { historyReplace } from '@shopgate/pwa-common/actions/router';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';

/**
 * @param {Object} state The application state.
 * @returns {Object}
 */
const mapStateToProps = state => ({
  route: getCurrentRoute(state),
});

/**
 * @param {Function} dispatch Dispatches a redux action.
 * @returns {Object}
 */
const mapDispatchToProps = dispatch => ({
  historyReplace: params => dispatch(historyReplace(params)),
});

export default connect(mapStateToProps, mapDispatchToProps);
