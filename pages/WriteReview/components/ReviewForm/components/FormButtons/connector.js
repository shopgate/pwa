import { connect } from 'react-redux';
import { isViewLoading } from '@shopgate/pwa-common/selectors/view';
import { getHistoryPathname } from '@shopgate/pwa-common/selectors/history';
import goBackHistory from '@shopgate/pwa-common/actions/history/goBackHistory';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  isLoading: isViewLoading(state, getHistoryPathname(state)),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  cancel: () => dispatch(goBackHistory()),
});

export default connect(mapStateToProps, mapDispatchToProps);
