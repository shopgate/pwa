import { connect } from 'react-redux';
import { historyPop } from '@shopgate/pwa-common/actions/router';
import { isViewLoading } from '@shopgate/pwa-common/selectors/view';
import { getHistoryPathname } from '@shopgate/pwa-common/selectors/history';

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
  cancel: () => dispatch(historyPop()),
});

/**
 * @param {Object} next The next component props.
 * @param {Object} prev The previous component props.
 * @returns {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (prev.isLoading !== next.isLoading) {
    return false;
  }

  return true;
};

export default connect(mapStateToProps, mapDispatchToProps, null, { areStatePropsEqual });
