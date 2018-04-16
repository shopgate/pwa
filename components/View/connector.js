import { connect } from 'react-redux';
import { getHistoryPathname } from '@shopgate/pwa-common/selectors/history';
import setTitle from './actions/setTitle';
import setViewTop from './action-creators/setViewTop';
import { getTopStatus, getTitle } from './selectors';

/**
 * Maps the contents of the state to the component props.
 * @param {Object} state The current application state.
 * @return {Object} The extended component props.
 */
const mapStateToProps = state => ({
  navigatorTitle: getTitle(state),
  historyPathname: getHistoryPathname(state),
  viewTop: getTopStatus(state),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  setTitle: title => dispatch(setTitle(title)),
  setTop: isTop => dispatch(setViewTop(isTop)),
});

export default connect(mapStateToProps, mapDispatchToProps);
