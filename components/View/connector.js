import { connect } from 'react-redux';
import { getCurrentPathname } from '@shopgate/pwa-common/selectors/router';
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
  historyPathname: getCurrentPathname(state),
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

/**
 * @param {Object} next The next component props.
 * @param {Object} prev The previous component props.
 * @return {boolean}
 */
const areStatePropsEqual = (next, prev) => {
  if (prev.navigatorTitle !== next.navigatorTitle) return false;
  if (prev.historyPathname !== next.historyPathname) return false;
  if (prev.viewTop !== next.viewTop) return false;
  return true;
};

export default connect(mapStateToProps, mapDispatchToProps, null, { areStatePropsEqual });
